import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const FilterControls = ({ filters, onFilterChange, onSearch, searchTerm }) => {
  const routeOptions = [
    { value: 'all', label: 'Todas las Rutas' },
    { value: 'R001', label: 'Ruta R001 - Centro' },
    { value: 'R002', label: 'Ruta R002 - Norte' },
    { value: 'R003', label: 'Ruta R003 - Sur' },
    { value: 'R004', label: 'Ruta R004 - Este' },
    { value: 'R005', label: 'Ruta R005 - Oeste' }
  ];

  const occupancyOptions = [
    { value: 'all', label: 'Todos los Niveles' },
    { value: 'low', label: 'Baja (0-50%)' },
    { value: 'medium', label: 'Media (51-75%)' },
    { value: 'high', label: 'Alta (76-89%)' },
    { value: 'critical', label: 'Crítica (90%+)' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos los Estados' },
    { value: 'Activo', label: 'Activo' },
    { value: 'En Ruta', label: 'En Ruta' },
    { value: 'Parada', label: 'En Parada' },
    { value: 'Mantenimiento', label: 'Mantenimiento' }
  ];

  const sortOptions = [
    { value: 'vehicleId', label: 'ID de Vehículo' },
    { value: 'routeNumber', label: 'Número de Ruta' },
    { value: 'occupancyPercentage', label: 'Porcentaje de Ocupación' },
    { value: 'lastUpdate', label: 'Última Actualización' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Input
              type="search"
              placeholder="Buscar por ID de vehículo o ruta..."
              value={searchTerm}
              onChange={(e) => onSearch(e?.target?.value)}
              className="pl-10"
            />
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Select
            options={routeOptions}
            value={filters?.route}
            onChange={(value) => onFilterChange('route', value)}
            placeholder="Filtrar por ruta"
            className="w-full sm:w-48"
          />

          <Select
            options={occupancyOptions}
            value={filters?.occupancy}
            onChange={(value) => onFilterChange('occupancy', value)}
            placeholder="Nivel de ocupación"
            className="w-full sm:w-48"
          />

          <Select
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => onFilterChange('status', value)}
            placeholder="Estado del autobús"
            className="w-full sm:w-48"
          />

          <Select
            options={sortOptions}
            value={filters?.sortBy}
            onChange={(value) => onFilterChange('sortBy', value)}
            placeholder="Ordenar por"
            className="w-full sm:w-48"
          />
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => {
            onFilterChange('route', 'all');
            onFilterChange('occupancy', 'all');
            onFilterChange('status', 'all');
            onFilterChange('sortBy', 'vehicleId');
            onSearch('');
          }}
          className="flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors duration-200"
        >
          <Icon name="X" size={14} />
          <span>Limpiar Filtros</span>
        </button>
      </div>
      {/* Active Filters Display */}
      {(filters?.route !== 'all' || filters?.occupancy !== 'all' || filters?.status !== 'all' || searchTerm) && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Filtros activos:</span>
          
          {filters?.route !== 'all' && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
              <span>Ruta: {filters?.route}</span>
              <button onClick={() => onFilterChange('route', 'all')}>
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          
          {filters?.occupancy !== 'all' && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
              <span>Ocupación: {occupancyOptions?.find(o => o?.value === filters?.occupancy)?.label}</span>
              <button onClick={() => onFilterChange('occupancy', 'all')}>
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          
          {filters?.status !== 'all' && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
              <span>Estado: {filters?.status}</span>
              <button onClick={() => onFilterChange('status', 'all')}>
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          
          {searchTerm && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
              <span>Búsqueda: "{searchTerm}"</span>
              <button onClick={() => onSearch('')}>
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterControls;