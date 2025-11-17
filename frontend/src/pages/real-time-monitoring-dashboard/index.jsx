import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import SystemMetrics from './components/SystemMetrics';
import FilterControls from './components/FilterControls';
import BusStatusGrid from './components/BusStatusGrid';
import ConnectionStatus from './components/ConnectionStatus';
import AlertsPanel from './components/AlertsPanel';
import Icon from '../../components/AppIcon';

const RealTimeMonitoringDashboard = () => {
  // Mock data for buses
  const mockBuses = [
    {
      id: 1,
      vehicleId: "BUS-001",
      routeNumber: "R001",
      currentOccupancy: 45,
      maxCapacity: 50,
      status: "En Ruta",
      currentLocation: "Av. Principal, Parada 15",
      lastUpdate: "18:20:45",
      driver: "Carlos Mendoza",
      nextStop: "Plaza Central"
    },
    {
      id: 2,
      vehicleId: "BUS-002", 
      routeNumber: "R002",
      currentOccupancy: 38,
      maxCapacity: 45,
      status: "Activo",
      currentLocation: "Calle Norte, Parada 8",
      lastUpdate: "18:20:30",
      driver: "María González",
      nextStop: "Terminal Norte"
    },
    {
      id: 3,
      vehicleId: "BUS-003",
      routeNumber: "R001", 
      currentOccupancy: 42,
      maxCapacity: 50,
      status: "En Ruta",
      currentLocation: "Centro Comercial, Parada 22",
      lastUpdate: "18:20:15",
      driver: "José Rodríguez",
      nextStop: "Universidad"
    },
    {
      id: 4,
      vehicleId: "BUS-004",
      routeNumber: "R003",
      currentOccupancy: 28,
      maxCapacity: 40,
      status: "Parada",
      currentLocation: "Terminal Sur, Parada 1",
      lastUpdate: "18:19:50",
      driver: "Ana López",
      nextStop: "Mercado Central"
    },
    {
      id: 5,
      vehicleId: "BUS-005",
      routeNumber: "R002",
      currentOccupancy: 41,
      maxCapacity: 45,
      status: "En Ruta",
      currentLocation: "Zona Industrial, Parada 12",
      lastUpdate: "18:20:10",
      driver: "Pedro Martínez",
      nextStop: "Parque Industrial"
    },
    {
      id: 6,
      vehicleId: "BUS-006",
      routeNumber: "R004",
      currentOccupancy: 15,
      maxCapacity: 35,
      status: "Activo",
      currentLocation: "Barrio Este, Parada 5",
      lastUpdate: "18:19:35",
      driver: "Laura Sánchez",
      nextStop: "Hospital Regional"
    },
    {
      id: 7,
      vehicleId: "BUS-007",
      routeNumber: "R005",
      currentOccupancy: 32,
      maxCapacity: 35,
      status: "En Ruta",
      currentLocation: "Zona Oeste, Parada 18",
      lastUpdate: "18:20:25",
      driver: "Roberto Silva",
      nextStop: "Centro Deportivo"
    },
    {
      id: 8,
      vehicleId: "BUS-008",
      routeNumber: "R003",
      currentOccupancy: 5,
      maxCapacity: 40,
      status: "Mantenimiento",
      currentLocation: "Taller Central",
      lastUpdate: "17:45:00",
      driver: "En Taller",
      nextStop: "N/A"
    }
  ];

  // Mock alerts data
  const mockAlerts = [
    {
      id: 1,
      type: "capacity",
      severity: "warning",
      title: "Capacidad Alta Detectada",
      message: "El autobús BUS-007 ha alcanzado el 91% de su capacidad máxima en Zona Oeste, Parada 18.",
      vehicleId: "BUS-007",
      routeNumber: "R005",
      timestamp: "18:20:25"
    },
    {
      id: 2,
      type: "maintenance",
      severity: "info",
      title: "Autobús en Mantenimiento",
      message: "El autobús BUS-008 está programado para mantenimiento preventivo.",
      vehicleId: "BUS-008",
      routeNumber: "R003",
      timestamp: "17:45:00"
    }
  ];

  // State management
  const [buses, setBuses] = useState(mockBuses);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filteredBuses, setFilteredBuses] = useState(mockBuses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    route: 'all',
    occupancy: 'all',
    status: 'all',
    sortBy: 'vehicleId'
  });
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date()?.toLocaleTimeString('es-ES'));
  const [dataSource, setDataSource] = useState('websocket');

  // System metrics calculation
  const systemMetrics = {
    totalActiveBuses: buses?.filter(bus => bus?.status !== 'Mantenimiento')?.length,
    averageOccupancy: Math.round(
      buses?.filter(bus => bus?.status !== 'Mantenimiento')?.reduce((acc, bus) => acc + (bus?.currentOccupancy / bus?.maxCapacity * 100), 0) / 
      buses?.filter(bus => bus?.status !== 'Mantenimiento')?.length
    ),
    capacityAlerts: alerts?.filter(alert => alert?.type === 'capacity')?.length,
    totalRoutes: [...new Set(buses.map(bus => bus.routeNumber))]?.length
  };

  // Filter and search logic
  const applyFilters = useCallback(() => {
    let filtered = [...buses];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered?.filter(bus => 
        bus?.vehicleId?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        bus?.routeNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        bus?.currentLocation?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Apply route filter
    if (filters?.route !== 'all') {
      filtered = filtered?.filter(bus => bus?.routeNumber === filters?.route);
    }

    // Apply occupancy filter
    if (filters?.occupancy !== 'all') {
      filtered = filtered?.filter(bus => {
        const percentage = (bus?.currentOccupancy / bus?.maxCapacity) * 100;
        switch (filters?.occupancy) {
          case 'low': return percentage <= 50;
          case 'medium': return percentage > 50 && percentage <= 75;
          case 'high': return percentage > 75 && percentage < 90;
          case 'critical': return percentage >= 90;
          default: return true;
        }
      });
    }

    // Apply status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(bus => bus?.status === filters?.status);
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (filters?.sortBy) {
        case 'vehicleId':
          return a?.vehicleId?.localeCompare(b?.vehicleId);
        case 'routeNumber':
          return a?.routeNumber?.localeCompare(b?.routeNumber);
        case 'occupancyPercentage':
          const aPercentage = (a?.currentOccupancy / a?.maxCapacity) * 100;
          const bPercentage = (b?.currentOccupancy / b?.maxCapacity) * 100;
          return bPercentage - aPercentage;
        case 'lastUpdate':
          return b?.lastUpdate?.localeCompare(a?.lastUpdate);
        default:
          return 0;
      }
    });

    setFilteredBuses(filtered);
  }, [buses, searchTerm, filters]);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses => 
        prevBuses?.map(bus => {
          if (bus?.status === 'Mantenimiento') return bus;
          
          // Randomly update occupancy
          const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
          const newOccupancy = Math.max(0, Math.min(bus?.maxCapacity, bus?.currentOccupancy + change));
          
          return {
            ...bus,
            currentOccupancy: newOccupancy,
            lastUpdate: new Date()?.toLocaleTimeString('es-ES')
          };
        })
      );
      
      setLastUpdate(new Date()?.toLocaleTimeString('es-ES'));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Event handlers
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleViewDetails = (bus) => {
    // In a real app, this would open a modal or navigate to details page
    console.log('View details for bus:', bus?.vehicleId);
  };

  const handleViewHistory = (bus) => {
    // In a real app, this would show historical data
    console.log('View history for bus:', bus?.vehicleId);
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
  };

  const handleViewBus = (vehicleId) => {
    // In a real app, this would highlight the bus in the grid
    console.log('View bus:', vehicleId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Icon name="Monitor" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Panel de Monitoreo en Tiempo Real
                </h1>
                <p className="text-muted-foreground">
                  Supervisión de capacidad y estado de la flota de autobuses
                </p>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <div className="mb-6">
            <ConnectionStatus 
              isConnected={isConnected}
              lastUpdate={lastUpdate}
              dataSource={dataSource}
            />
          </div>

          {/* System Metrics */}
          <div className="mb-6">
            <SystemMetrics metrics={systemMetrics} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Dashboard Area */}
            <div className="xl:col-span-3 space-y-6">
              {/* Filter Controls */}
              <FilterControls
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                searchTerm={searchTerm}
              />

              {/* Bus Status Grid */}
              <BusStatusGrid
                buses={filteredBuses}
                onViewDetails={handleViewDetails}
                onViewHistory={handleViewHistory}
              />

              {/* Results Summary */}
              <div className="flex items-center justify-between text-sm text-muted-foreground bg-card border border-border rounded-lg px-4 py-3">
                <span>
                  Mostrando {filteredBuses?.length} de {buses?.length} autobuses
                </span>
                <span>
                  Última actualización: {lastUpdate}
                </span>
              </div>
            </div>

            {/* Alerts Sidebar */}
            <div className="xl:col-span-1">
              <AlertsPanel
                alerts={alerts}
                onDismissAlert={handleDismissAlert}
                onViewBus={handleViewBus}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RealTimeMonitoringDashboard;