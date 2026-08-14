'use client';

import React from 'react';
import { ConnectorItem } from './types';
import { ConnectorCard } from './ConnectorCard';
import { cn } from '../../lib/utils';

export interface ConnectorGridProps {
  connectors: ConnectorItem[];
  onConnect: (connector: ConnectorItem) => void;
  onManage: (connector: ConnectorItem) => void;
  className?: string;
}

export const ConnectorGrid: React.FC<ConnectorGridProps> = ({
  connectors,
  onConnect,
  onManage,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5', className)}>
      {connectors.map((connector) => (
        <ConnectorCard
          key={connector.id}
          connector={connector}
          onConnect={onConnect}
          onManage={onManage}
        />
      ))}
    </div>
  );
};
