import React from 'react';
import type { NavTab } from '../../types';
import {
  Activity, BarChart3, BookOpen, CloudSun, ClipboardCheck, FileText, History, Info,
  LayoutDashboard, Map, Radio, RefreshCw, Settings2, ShieldCheck, Sprout, Store, Users, Plane
} from 'lucide-react';

interface SidebarProps {
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  pendingValidationCount: number;
  pendingRequestsCount: number;
  onNavigatePath?: (path: string) => void;
}

const groups: { title: string; items: { id: NavTab; label: string; icon: React.ElementType; badge?: 'requests' | 'validation' }[] }[] = [
  { title: 'Workspace', items: [{ id: 'dashboard', label: 'Overview', icon: LayoutDashboard }] },
  { title: 'Field operations', items: [
    { id: 'requests', label: 'Scan requests', icon: FileText, badge: 'requests' },
    { id: 'farmers', label: 'Farmers', icon: Users },
    { id: 'fields', label: 'Fields & boundaries', icon: Map },
    { id: 'soil-card', label: 'Soil Health Cards', icon: Sprout },
  ] },
  { title: 'Flight operations', items: [
    { id: 'drones', label: 'Drone fleet', icon: Plane },
    { id: 'active-flight', label: 'Active flight', icon: Radio },
    { id: 'operations', label: 'Mission operations', icon: Activity },
    { id: 'flight-history', label: 'Flight history', icon: History },
  ] },
  { title: 'Field intelligence', items: [
    { id: 'validation', label: 'Ground validation', icon: ClipboardCheck, badge: 'validation' },
    { id: 'recommendations', label: 'Recommendations', icon: ShieldCheck },
    { id: 'reports', label: 'Field reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'weather', label: 'Weather & alerts', icon: CloudSun },
    { id: 'stores', label: 'Nearby agri-stores', icon: Store },
    { id: 'library', label: 'Crop reference', icon: BookOpen },
  ] },
  { title: 'System', items: [
    { id: 'sync', label: 'Sync & data health', icon: RefreshCw },
    { id: 'activity', label: 'Activity log', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ] },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onNavigate, pendingValidationCount, pendingRequestsCount, onNavigatePath }) => {
  const badgeCount = (badge?: 'requests' | 'validation') => badge === 'requests' ? pendingRequestsCount : badge === 'validation' ? pendingValidationCount : 0;
  return (
    <aside className="app-sidebar">
      <div className="app-sidebar-scroll">
        <button className="app-brand" onClick={() => onNavigate('dashboard')} aria-label="AgriVyaan overview">
          <span className="app-brand-mark"><Sprout size={19} strokeWidth={1.8} /></span>
          <span className="app-brand-copy"><strong>AgriVyaan</strong><small>FIELD INTELLIGENCE</small></span>
          <span className="app-brand-status" title="Operator workspace"><span className="pulse-dot" /></span>
        </button>
        <nav className="app-sidebar-nav" aria-label="Main navigation">
          {groups.map(group => (
            <section className="app-nav-group" key={group.title}>
              <h2>{group.title}</h2>
              {group.items.map(item => {
                const Icon = item.icon;
                const active = activeTab === item.id || (item.id === 'fields' && activeTab === 'field-details') || (item.id === 'operations' && activeTab === 'operation-details');
                const count = badgeCount(item.badge);
                return <button key={item.id} className={`app-nav-item${active ? ' is-active' : ''}`} aria-current={active ? 'page' : undefined} onClick={() => onNavigate(item.id)}>
                  <Icon size={16} strokeWidth={1.8} /><span className="app-nav-label">{item.label}</span>{count > 0 && <span className="app-nav-badge">{count}</span>}
                </button>;
              })}
            </section>
          ))}
          <section className="app-nav-group app-about-group">
            <h2>Discover</h2>
            <button className="app-nav-item" onClick={() => onNavigatePath ? onNavigatePath('/about') : window.location.assign('/about')}><Info size={16}/><span className="app-nav-label">About AgriVyaan</span></button>
          </section>
        </nav>
      </div>
      <div className="app-sidebar-footer">
        <div className="app-connection-card"><span className="app-connection-icon"><ShieldCheck size={15}/></span><span><b>Operator workspace</b><small>Demo environment</small></span><span className="app-connection-dot"/></div>
        <div className="app-sidebar-footnote">AGRIVYAAN <span>·</span> FIELD OPERATIONS</div>
      </div>
    </aside>
  );
};
