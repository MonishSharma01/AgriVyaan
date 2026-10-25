import React, { useEffect, useState } from 'react';
import { Check, Cloud, Cpu, Radio, RotateCcw, Save, ShieldCheck, SlidersHorizontal } from 'lucide-react';

type OperatorSettings = {
  telemetryMs: string;
  confidence: string;
  band: string;
  offlineCache: boolean;
};

const initialSettings: OperatorSettings = {
  telemetryMs: '2000',
  confidence: '75',
  band: 'ndvi',
  offlineCache: true,
};
const settingsKey = 'agrivyaan.operator.settings';
const cardStyle: React.CSSProperties = { background:'#fff', border:'1px solid #e4e6dd', borderRadius:12, padding:20, boxShadow:'0 4px 18px rgba(37,48,31,.035)' };
const labelStyle: React.CSSProperties = { display:'block', marginBottom:6, color:'#6e7569', fontSize:11, fontWeight:700, letterSpacing:'.07em', textTransform:'uppercase' };

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<OperatorSettings>(() => {
    try {
      const saved = localStorage.getItem(settingsKey);
      return saved ? { ...initialSettings, ...JSON.parse(saved) as Partial<OperatorSettings> } : initialSettings;
    } catch { return initialSettings; }
  });
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (!savedNotice) return;
    const timer = window.setTimeout(() => setSavedNotice(false), 3200);
    return () => window.clearTimeout(timer);
  }, [savedNotice]);

  const update = <K extends keyof OperatorSettings>(key: K, value: OperatorSettings[K]) => {
    setSettings(current => ({ ...current, [key]: value }));
    setSavedNotice(false);
  };
  const save = () => {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
    setSavedNotice(true);
  };
  const reset = () => {
    setSettings(initialSettings);
    localStorage.removeItem(settingsKey);
    setSavedNotice(false);
  };

  return <div style={{ maxWidth:1240, margin:'0 auto', padding:'30px 32px 42px', display:'flex', flexDirection:'column', gap:20 }}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:20 }}>
      <div>
        <div style={{ fontSize:10, fontWeight:800, letterSpacing:'.13em', color:'#7c8972', textTransform:'uppercase', marginBottom:8 }}>WORKSPACE / PREFERENCES</div>
        <h1 style={{ fontFamily:'Georgia,serif', fontSize:34, fontWeight:500, letterSpacing:'-.035em', color:'#202a1e', margin:'0 0 8px' }}>Operator settings</h1>
        <p style={{ fontSize:13, color:'#747a70', margin:0 }}>Local preferences for the field workspace and demo flight views.</p>
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button className="op-btn op-btn-secondary" onClick={reset}><RotateCcw size={14}/> Reset</button>
        <button className="op-btn op-btn-primary" onClick={save}><Save size={14}/> Save preferences</button>
      </div>
    </div>

    {savedNotice && <div role="status" style={{ ...cardStyle, padding:'11px 14px', display:'flex', alignItems:'center', gap:8, color:'#45633e', background:'#f0f4eb', fontSize:12 }}><Check size={15}/> Preferences saved on this device.</div>}
    <div style={{ padding:'13px 16px', display:'flex', alignItems:'flex-start', gap:11, border:'1px solid #eadfc8', borderRadius:10, background:'#faf6ec', color:'#786743', fontSize:12, lineHeight:1.55 }}><ShieldCheck size={16} style={{ flex:'0 0 auto', marginTop:1 }}/>Demo workspace: these preferences are stored in this browser. They do not change the connected flight controller, AI service, or cloud account.</div>

    <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:16 }}>
      <section style={cardStyle}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}><span style={{ width:34,height:34,display:'grid',placeItems:'center',borderRadius:9,background:'#edf2e8',color:'#59724d' }}><Radio size={17}/></span><div><h2 style={{ margin:0,fontSize:15,color:'#2c3828' }}>Flight telemetry</h2><div style={{ marginTop:3,fontSize:11,color:'#8b9087' }}>Display and refresh preferences</div></div></div>
        <label style={labelStyle} htmlFor="telemetry-frequency">Refresh interval</label>
        <select id="telemetry-frequency" className="op-select" style={{ width:'100%', minHeight:38 }} value={settings.telemetryMs} onChange={event=>update('telemetryMs',event.target.value)}>
          <option value="1000">1 second · High frequency</option><option value="2000">2 seconds · Balanced</option><option value="5000">5 seconds · Low bandwidth</option>
        </select>
        <div style={{ marginTop:16,paddingTop:14,borderTop:'1px solid #eef0ea',display:'flex',justifyContent:'space-between',fontSize:12 }}><span style={{ color:'#7f857b' }}>Aircraft profile</span><b style={{ color:'#3e4b38' }}>Example · AgriScout X2</b></div>
        <div style={{ marginTop:10,display:'flex',justifyContent:'space-between',fontSize:12 }}><span style={{ color:'#7f857b' }}>Flight telemetry</span><span style={{ color:'#927343',fontWeight:700 }}>Demo stream</span></div>
      </section>

      <section style={cardStyle}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}><span style={{ width:34,height:34,display:'grid',placeItems:'center',borderRadius:9,background:'#f2eee3',color:'#917445' }}><SlidersHorizontal size={17}/></span><div><h2 style={{ margin:0,fontSize:15,color:'#2c3828' }}>Crop analysis</h2><div style={{ marginTop:3,fontSize:11,color:'#8b9087' }}>Review thresholds for the potato demo model</div></div></div>
        <label style={labelStyle} htmlFor="confidence-threshold">Finding confidence threshold</label>
        <select id="confidence-threshold" className="op-select" style={{ width:'100%', minHeight:38 }} value={settings.confidence} onChange={event=>update('confidence',event.target.value)}>
          <option value="70">70% · Earlier review</option><option value="75">75% · Balanced</option><option value="85">85% · Higher confidence</option>
        </select>
        <label style={{ ...labelStyle, marginTop:16 }} htmlFor="spectral-band">Vegetation index</label>
        <select id="spectral-band" className="op-select" style={{ width:'100%', minHeight:38 }} value={settings.band} onChange={event=>update('band',event.target.value)}>
          <option value="ndvi">NDVI · Canopy vigor</option><option value="ndre">NDRE · Chlorophyll response</option><option value="rgb">RGB · Visual review</option>
        </select>
      </section>

      <section style={cardStyle}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}><span style={{ width:34,height:34,display:'grid',placeItems:'center',borderRadius:9,background:'#edf2e8',color:'#59724d' }}><Cpu size={17}/></span><div><h2 style={{ margin:0,fontSize:15,color:'#2c3828' }}>Field device</h2><div style={{ marginTop:3,fontSize:11,color:'#8b9087' }}>Offline readiness on this browser</div></div></div>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,padding:'13px 0',borderTop:'1px solid #eef0ea' }}><div><b style={{ display:'block',fontSize:12,color:'#394633' }}>Cache map and workspace shell</b><span style={{ display:'block',marginTop:4,fontSize:11,color:'#858a80' }}>Basemap tiles still require an internet connection.</span></div><button type="button" role="switch" aria-checked={settings.offlineCache} onClick={()=>update('offlineCache',!settings.offlineCache)} style={{ width:42,height:24,padding:3,border:0,borderRadius:15,background:settings.offlineCache?'#607852':'#c5c9bf',cursor:'pointer',transition:'background .2s' }}><span style={{ width:18,height:18,display:'block',borderRadius:'50%',background:'#fff',transform:settings.offlineCache?'translateX(18px)':'translateX(0)',transition:'transform .2s',boxShadow:'0 1px 3px #0003' }}/></button></div>
      </section>

      <section style={cardStyle}>
        <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14 }}><span style={{ width:34,height:34,display:'grid',placeItems:'center',borderRadius:9,background:'#eaf0f1',color:'#557786' }}><Cloud size={17}/></span><div><h2 style={{ margin:0,fontSize:15,color:'#2c3828' }}>Workspace connection</h2><div style={{ marginTop:3,fontSize:11,color:'#8b9087' }}>Integration status for this build</div></div></div>
        <div style={{ display:'flex',justifyContent:'space-between',gap:12,padding:'12px 0',borderTop:'1px solid #eef0ea',fontSize:12 }}><span style={{ color:'#7f857b' }}>Database integration</span><b style={{ color:'#3e4b38' }}>Environment configured</b></div>
        <div style={{ display:'flex',justifyContent:'space-between',gap:12,padding:'12px 0',borderTop:'1px solid #eef0ea',fontSize:12 }}><span style={{ color:'#7f857b' }}>Endpoint source</span><code style={{ color:'#55624f' }}>VITE_SUPABASE_URL</code></div>
        <div style={{ fontSize:11,color:'#92968d',lineHeight:1.55 }}>Credentials are managed outside this preferences screen.</div>
      </section>
    </div>
  </div>;
};