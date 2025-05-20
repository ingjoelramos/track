import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { ArrowUpDown, GripVertical, X, Settings, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { formatDateTime } from '../../lib/utils';
import { Visit } from '../../types';

interface StatsTableProps {
  visits: Visit[];
  onClose: () => void;
}

interface ColumnDef {
  id: keyof Visit | 'ts';
  label: string;
  visible: boolean;
  width?: string;
  render?: (value: any) => React.ReactNode;
}

function SortableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export function StatsTable({ visits, onClose }: StatsTableProps) {
  const [columns, setColumns] = useState<ColumnDef[]>([
    { 
      id: 'ts', 
      label: 'Timestamp', 
      visible: true,
      width: '180px',
      render: (value) => formatDateTime(value)
    },
    { id: 'browser', label: 'Browser', visible: true },
    { id: 'device', label: 'Device', visible: true },
    { id: 'country', label: 'Country', visible: true },
    { id: 'region', label: 'Region', visible: true },
    { id: 'city', label: 'City', visible: true },
    { id: 'visitor_type', label: 'Visitor Type', visible: true },
    { id: 'traffic_type', label: 'Traffic Type', visible: true },
    { id: 'source', label: 'Source', visible: true },
    { 
      id: 'isVpn', 
      label: 'VPN/Proxy', 
      visible: true,
      render: (value) => (
        <Badge variant={value ? 'error' : 'success'}>
          {value ? 'VPN' : 'Clean'}
        </Badge>
      )
    },
    { id: 'os', label: 'OS', visible: true },
    { id: 'language', label: 'Language', visible: true },
    { id: 'connection', label: 'Connection', visible: true },
    { id: 'carrier', label: 'Carrier', visible: false },
    { id: 'device_id', label: 'Device ID', visible: false },
    { id: 'ip', label: 'IP Address', visible: false },
  ]);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Visit | 'ts';
    direction: 'asc' | 'desc';
  }>({ key: 'ts', direction: 'desc' });

  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSort = (key: keyof Visit | 'ts') => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const toggleColumn = (id: keyof Visit | 'ts') => {
    setColumns(columns.map(col => 
      col.id === id ? { ...col, visible: !col.visible } : col
    ));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const sortedVisits = [...visits].sort((a, b) => {
    const aValue = a[sortConfig.key as keyof Visit];
    const bValue = b[sortConfig.key as keyof Visit];
    
    if (aValue === bValue) return 0;
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    
    const comparison = aValue < bValue ? -1 : 1;
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  const exportToCSV = () => {
    const visibleColumns = columns.filter(col => col.visible);
    const headers = visibleColumns.map(col => col.label).join(',');
    const rows = sortedVisits.map(visit => 
      visibleColumns.map(col => {
        const value = visit[col.id as keyof Visit];
        return typeof value === 'string' ? `"${value}"` : value;
      }).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stats-export-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Detailed Statistics</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToCSV}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowColumnSelector(!showColumnSelector)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Customize Columns
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {showColumnSelector && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={columns.map(col => col.id)}>
                {columns.map((column) => (
                  <SortableColumn key={column.id} id={column.id}>
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      <input
                        type="checkbox"
                        checked={column.visible}
                        onChange={() => toggleColumn(column.id)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{column.label}</span>
                    </div>
                  </SortableColumn>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      )}

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {columns.filter(col => col.visible).map((column) => (
                  <th
                    key={column.id}
                    className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort(column.id)}
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedVisits.map((visit) => (
                <tr key={visit.id} className="border-b border-gray-200 dark:border-gray-700">
                  {columns.filter(col => col.visible).map((column) => (
                    <td key={column.id} className="px-4 py-3 text-sm">
                      {column.render ? 
                        column.render(visit[column.id as keyof Visit]) :
                        String(visit[column.id as keyof Visit] || '-')
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}