import React from 'react';
import type { NavTab, DroneOperation, FarmerRequest, CropFinding, ZoneData, ActivityItem, AssessmentReport, FieldAsset } from '../../types';
import { OperationalMap } from '../gis/OperationalMap';
import { AlertTriangle, ChevronRight } from 'lucide-react';

interface DashboardViewProps {
  operations: DroneOperation[];
  requests: FarmerRequest[];
  findings: CropFinding[];
  zones: ZoneData[];
  activities: ActivityItem[];
  reports: AssessmentReport[];
  field: FieldAsset;
  onNavigate: (tab: NavTab) => void;
  onSelectOperation: (opId: string) => void;
  onSelectField: (fieldId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  operations,
  requests,
  findings,
  zones,
  activities,
  reports,
  field,
  onNavigate,
  onSelectOperation,
  onSelectField
}) => {
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;
  const inProgressOps = operations.filter(o => o.status === 'In Progress').length;
  const pendingValidations = findings.filter(f => f.status === 'Pending Validation').length;
  const highPriorityRequests = requests.filter(r => r.status === 'Pending' && r.priority === 'High');
  const reportsReady = reports.filter(report => report.status === 'Ready').length;
  const completedOperations = operations.filter(operation => operation.status === 'Completed').length;
  const activeOperation = operations.find(operation => operation.status === 'In Progress');
  const inspectionZones = zones.filter(zone => zone.status === 'Low moisture' || zone.status === 'High Priority');
  const todayLabel = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header & Operational Status Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#20231F', letterSpacing: '-0.3px', margin: 0 }}>
              Good morning, Operator
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7068', marginTop: '4px' }}>
              {todayLabel} · {field.crop} operations · {pendingValidations} validation items need review
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="op-btn op-btn-secondary"
              onClick={() => onNavigate('requests')}
            >
              + New Operation Schedule
            </button>
            <button 
              className="op-btn op-btn-primary"
              onClick={() => onNavigate('validation')}
            >
              Review AI Detections ({pendingValidations})
            </button>
          </div>
        </div>

        {/* Restrained Horizontal Operational Summary (Typography & Subtle Separators, NO Floating Giant Cards) */}
        <div className="dashboard-summary"
          style={{
            marginTop: '16px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #DDDED7',
            borderRadius: '4px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div className="dashboard-summary-metrics" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#6B7068', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Requests</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#20231F' }}>{requests.length} Requests</div>
            </div>
            <div style={{ height: '24px', width: '1px', backgroundColor: '#DDDED7' }} />
            
            <div>
              <span style={{ fontSize: '11px', color: '#6B7068', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#B8862D' }}>{pendingRequests} Pending</div>
            </div>
            <div style={{ height: '24px', width: '1px', backgroundColor: '#DDDED7' }} />

            <div>
              <span style={{ fontSize: '11px', color: '#6B7068', textTransform: 'uppercase', letterSpacing: '0.5px' }}>In Progress</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#55758A' }}>{inProgressOps} In Progress</div>
            </div>
            <div style={{ height: '24px', width: '1px', backgroundColor: '#DDDED7' }} />

            <div>
              <span style={{ fontSize: '11px', color: '#6B7068', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Validation Required</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#B64A43' }}>{pendingValidations} Required</div>
            </div>
            <div style={{ height: '24px', width: '1px', backgroundColor: '#DDDED7' }} />

            <div>
              <span style={{ fontSize: '11px', color: '#6B7068', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reports Ready</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#4F6848' }}>{reportsReady} Ready</div>
            </div>
            <div style={{ height: '24px', width: '1px', backgroundColor: '#DDDED7' }} />

            <div>
              <span style={{ fontSize: '11px', color: '#6B7068', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Completed</span>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#30432E' }}>{completedOperations} Completed</div>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('analytics')}
            style={{ fontSize: '12px', color: '#4F6848', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            View Fleet Telemetry <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Main Operational Split: GIS Map + Active Operations + Attention Items */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '20px', width: '100%' }}>
        {/* Left Column: Dominant Today's Field Operations GIS Map & List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #DDDED7',
              borderRadius: '4px',
              padding: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#20231F', margin: 0 }}>
                  TODAY'S FIELD OPERATIONS
                </h2>
                <div style={{ fontSize: '12px', color: '#6B7068' }}>
                  {activeOperation ? `Live spatial coverage · ${activeOperation.fieldName} · ${activeOperation.id} active (${activeOperation.progressPercent}%)` : `${field.name} · ${field.crop} · ${field.areaHa.toFixed(2)} ha`}
                </div>
              </div>
              <button 
                className="op-btn op-btn-secondary op-btn-sm"
                onClick={() => onSelectField('FIELD-A')}
              >
                Open Full Field Spatial Workspace
              </button>
            </div>

            <div style={{ position:'relative',height:380,border:'1px solid #e3e5dc',borderRadius:10,overflow:'hidden' }}>
              <OperationalMap mode="flight" field={field} zones={zones} onSelectZone={() => onSelectField(field.id)} />
            </div>

            {/* Operational Quick Switcher below map */}
            <div style={{ marginTop: '14px', borderTop: '1px solid #EBECE6', paddingTop: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7068', textTransform: 'uppercase', marginBottom: '8px' }}>
                Active Drone Missions
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {operations.slice(0, 3).map(op => (
                  <div
                    key={op.id}
                    onClick={() => onSelectOperation(op.id)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      backgroundColor: op.status === 'In Progress' ? '#EEF3F6' : '#FAFBF8',
                      border: `1px solid ${op.status === 'In Progress' ? '#55758A' : '#DDDED7'}`,
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#20231F' }}>{op.id}</span>
                      <span className={`badge badge-${op.status.toLowerCase().replace(' ', '-')}`}>
                        {op.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7068', marginTop: '2px' }}>
                      {op.fieldName} · {op.droneId}
                    </div>
                    {op.status === 'In Progress' && (
                      <div style={{ width: '100%', backgroundColor: '#DDDED7', height: '4px', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${op.progressPercent}%`, backgroundColor: '#55758A', height: '100%' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Attention Required & Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* ATTENTION REQUIRED Panel */}
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #DDDED7',
              borderRadius: '4px',
              padding: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #EBECE6' }}>
              <AlertTriangle size={16} color="#B64A43" />
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#20231F', margin: 0 }}>
                ATTENTION REQUIRED
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Item 1: 3 Findings require validation */}
              <div 
                onClick={() => onNavigate('validation')}
                style={{
                  padding: '10px',
                  borderRadius: '3px',
                  backgroundColor: '#FAF0E6',
                  border: '1px solid rgba(182, 74, 67, 0.3)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#B64A43' }}>
                    {pendingValidations} Finding{pendingValidations === 1 ? '' : 's'} Require Validation
                  </span>
                  <ChevronRight size={14} color="#B64A43" />
                </div>
                <div style={{ fontSize: '11px', color: '#6B7068', marginTop: '3px' }}>
                  {findings.find(finding => finding.status === 'Pending Validation')?.id ?? 'No pending findings'} · {findings.find(finding => finding.status === 'Pending Validation')?.findingType ?? 'All findings have been reviewed.'}
                </div>
              </div>

              {/* Item 2: Urgent Requests */}
              <div 
                onClick={() => onNavigate('requests')}
                style={{
                  padding: '10px',
                  borderRadius: '3px',
                  backgroundColor: '#FBF6EB',
                  border: '1px solid rgba(184, 134, 45, 0.3)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#B8862D' }}>
                    {highPriorityRequests.length} Urgent Farmer Request{highPriorityRequests.length === 1 ? '' : 's'}
                  </span>
                  <ChevronRight size={14} color="#B8862D" />
                </div>
                <div style={{ fontSize: '11px', color: '#6B7068', marginTop: '3px' }}>
                  {highPriorityRequests[0] ? `${highPriorityRequests[0].id} (${highPriorityRequests[0].farmerName} · ${highPriorityRequests[0].fieldName}): ${highPriorityRequests[0].notes}` : 'No high-priority requests are waiting.'}
                </div>
              </div>

              {/* Item 3: Ground inspection */}
              <div 
                onClick={() => onSelectField('FIELD-A')}
                style={{
                  padding: '10px',
                  borderRadius: '3px',
                  backgroundColor: '#FAFBF8',
                  border: '1px solid #DDDED7',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#20231F' }}>
                    {inspectionZones.length} Ground Inspection{inspectionZones.length === 1 ? '' : 's'} Recommended
                  </span>
                  <ChevronRight size={14} color="#6B7068" />
                </div>
                <div style={{ fontSize: '11px', color: '#6B7068', marginTop: '3px' }}>
                  {inspectionZones[0] ? `${inspectionZones[0].id}: ${inspectionZones[0].soilMoisture}% moisture · ${inspectionZones[0].gpsCoords}` : 'No ground checks are queued for this field.'}
                </div>
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY Timeline */}
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #DDDED7',
              borderRadius: '4px',
              padding: '14px',
              flex: 1
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #EBECE6' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#20231F', margin: 0 }}>
                Recent Audit Timeline
              </h2>
              <button 
                onClick={() => onNavigate('activity')}
                style={{ fontSize: '11px', color: '#4F6848', fontWeight: 600 }}
              >
                Full Log
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} style={{ display: 'flex', gap: '10px', fontSize: '11px' }}>
                  <div style={{ color: '#6B7068', fontFamily: 'monospace', width: '50px', flexShrink: 0 }}>
                    {act.timestamp}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#20231F' }}>{act.title}</div>
                    <div style={{ color: '#6B7068', fontSize: '11px', lineHeight: 1.3 }}>{act.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
