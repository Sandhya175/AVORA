import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Bell, Palette, Lock, Globe, Download, Trash2, ChevronRight, Check, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme, getTheme } from './ThemeContext';
import { AvoraLogo } from './AvoraLogo';
import { useIsMobile } from '../hooks/use-mobile';

const accentColors = [
  { name: 'Purple', primary: '#8B5CF6', secondary: '#6366F1' },
  { name: 'Blue', primary: '#3B82F6', secondary: '#6366F1' },
  { name: 'Rose', primary: '#EC4899', secondary: '#F43F5E' },
  { name: 'Amber', primary: '#F59E0B', secondary: '#EF4444' },
  { name: 'Emerald', primary: '#10B981', secondary: '#06B6D4' },
  { name: 'Indigo', primary: '#6366F1', secondary: '#8B5CF6' },
];

type SettingsSection = 'profile' | 'appearance' | 'notifications' | 'productivity' | 'security' | 'account';

const sections: { id: SettingsSection; icon: typeof User; label: string }[] = [
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'productivity', icon: Monitor, label: 'Productivity' },
  { id: 'security', icon: Lock, label: 'Security' },
  { id: 'account', icon: Globe, label: 'Account' },
];

interface ToggleProps { checked: boolean; onChange: () => void; color?: string; }
function Toggle({ checked, onChange, color = '#8B5CF6' }: ToggleProps) {
  return (
    <div onClick={onChange} style={{ width: 44, height: 24, borderRadius: 12, cursor: 'pointer', background: checked ? color : 'rgba(100,116,139,0.3)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <motion.div animate={{ x: checked ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{ position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
    </div>
  );
}

export function SettingsPage() {
  const { isDark, theme, setTheme } = useTheme();
  const t = getTheme(isDark);
  const isMobile = useIsMobile();
  
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [selectedAccent, setSelectedAccent] = useState(0);
  const [notifSettings, setNotifSettings] = useState(() => {
    const saved = localStorage.getItem('avora_notif_settings');
    return saved ? JSON.parse(saved) : { taskReminders: true, focusAlerts: true, weeklyReport: true, aiInsights: false, teamUpdates: true };
  });
  const [prodSettings, setProdSettings] = useState(() => {
    const saved = localStorage.getItem('avora_prod_settings');
    return saved ? JSON.parse(saved) : { autoFocus: true, breakReminders: true, dailyGoal: 8, pomodoroLength: 25, shortBreak: 5, longBreak: 15 };
  });
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('avora_profile');
    return saved ? JSON.parse(saved) : { name: 'Sandhya Tiwari', email: 'sandhya@company.com', role: 'Product Designer', timezone: 'Asia/Kolkata' };
  });

  const saveProfile = () => {
    localStorage.setItem('avora_profile', JSON.stringify(profile));
    alert('Profile saved successfully!');
  };

  const updateNotifSetting = (key: string, value: boolean) => {
    const newSettings = { ...notifSettings, [key]: value };
    setNotifSettings(newSettings);
    localStorage.setItem('avora_notif_settings', JSON.stringify(newSettings));
  };

  const updateProdSetting = (key: string, value: any) => {
    const newSettings = { ...prodSettings, [key]: value };
    setProdSettings(newSettings);
    localStorage.setItem('avora_prod_settings', JSON.stringify(newSettings));
  };

  const card: React.CSSProperties = {
    background: t.cardBg, backdropFilter: 'blur(20px)',
    border: `1px solid ${t.border}`, borderRadius: 18, boxShadow: t.shadow,
  };

  const inputStyle: React.CSSProperties = {
    background: t.inputBg, border: `1px solid ${t.border}`,
    borderRadius: 10, padding: '9px 14px', color: t.text, fontSize: 14,
    outline: 'none', width: '100%', transition: 'border-color 0.2s',
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: 11, color: t.textDim, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
    marginBottom: 10, marginTop: 18,
  };

  const settingRow = (label: string, sub: string, control: React.ReactNode) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${t.borderSubtle}` }}>
      <div style={{ paddingRight: 12 }}>
        <div style={{ fontSize: 14, color: t.text, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>{sub}</div>
      </div>
      {control}
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: '20px', background: isDark ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.04)', borderRadius: 14, border: `1px solid ${t.border}`, flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#8B5CF6,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, color: 'white', fontWeight: 700, boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}>
                ST
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>{profile.name}</div>
                <div style={{ fontSize: 13, color: t.textMuted }}>{profile.role}</div>
                <button style={{ marginTop: 8, background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', border: 'none', borderRadius: 8, padding: '5px 14px', color: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  Change Photo
                </button>
              </div>
            </div>

            <div style={sectionLabel}>Personal Information</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Full Name', key: 'name', placeholder: 'Your full name' },
                { label: 'Email', key: 'email', placeholder: 'your@email.com' },
                { label: 'Job Title', key: 'role', placeholder: 'Your role' },
                { label: 'Timezone', key: 'timezone', placeholder: 'Your timezone' },
              ].map(field => (
                <div key={field.key}>
                  <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 5 }}>{field.label}</div>
                  <input
                    value={(profile as any)[field.key]}
                    onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveProfile}
              style={{ marginTop: 20, background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', border: 'none', borderRadius: 10, padding: '11px 28px', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 16px rgba(139,92,246,0.4)', width: isMobile ? '100%' : 'auto' }}
            >
              Save Changes
            </motion.button>
          </div>
        );

      case 'appearance':
        return (
          <div>
            <div style={sectionLabel}>Theme</div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
              {[
                { label: 'Dark', icon: Moon, value: 'dark' as const },
                { label: 'Light', icon: Sun, value: 'light' as const },
                { label: 'System', icon: Monitor, value: 'system' as const },
              ].map(opt => {
                const isActive = theme === opt.value;
                return (
                  <div
                    key={opt.label}
                    onClick={() => setTheme(opt.value)}
                    style={{
                      padding: '16px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                      border: isActive ? `2px solid ${t.primary}` : `1px solid ${t.border}`,
                      background: isActive ? `${t.primary}12` : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'),
                      boxShadow: isActive ? `0 0 16px ${t.primary}25` : 'none',
                    }}
                  >
                    <opt.icon size={20} color={isActive ? t.primary : t.textMuted} style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: 13, color: isActive ? t.primary : t.textMuted, fontWeight: isActive ? 600 : 400 }}>{opt.label}</div>
                  </div>
                );
              })}
            </div>

            <div style={sectionLabel}>Accent Color</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24, justifyContent: isMobile ? 'center' : 'flex-start' }}>
              {accentColors.map((color, i) => (
                <div key={color.name} onClick={() => setSelectedAccent(i)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: `linear-gradient(135deg,${color.primary},${color.secondary})`,
                    border: selectedAccent === i ? '3px solid white' : '3px solid transparent',
                    outline: selectedAccent === i ? `2px solid ${color.primary}` : 'none',
                    boxShadow: selectedAccent === i ? `0 0 14px ${color.primary}60` : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}>
                    {selectedAccent === i && <Check size={16} color="white" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: 10, color: t.textDim }}>{color.name}</span>
                </div>
              ))}
            </div>

            <div style={sectionLabel}>Interface Options</div>
            {settingRow('Compact Mode', 'Reduce padding and spacing between items', <Toggle checked={false} onChange={() => {}} />)}
            {settingRow('Animations', 'Enable interactive card transitions', <Toggle checked={true} onChange={() => {}} />)}
            {settingRow('Glassmorphic Blur', 'Apply transparency and glow layers', <Toggle checked={isDark} onChange={() => {}} />)}
          </div>
        );

      case 'notifications':
        return (
          <div>
            <div style={sectionLabel}>Task Alerts</div>
            {settingRow('Task Reminders', 'Get notified prior to task deadlines', <Toggle checked={notifSettings.taskReminders} onChange={() => updateNotifSetting('taskReminders', !notifSettings.taskReminders)} />)}
            {settingRow('Overdue Warnings', 'Trigger alerts when task deadlines pass', <Toggle checked={true} onChange={() => {}} />)}
            {settingRow('Workspace Updates', 'Updates about shared checklists', <Toggle checked={notifSettings.teamUpdates} onChange={() => updateNotifSetting('teamUpdates', !notifSettings.teamUpdates)} />)}

            <div style={sectionLabel}>Focus Alerts</div>
            {settingRow('Session Alerts', 'Audible alert when timer cycles finish', <Toggle checked={notifSettings.focusAlerts} onChange={() => updateNotifSetting('focusAlerts', !notifSettings.focusAlerts)} />)}
            {settingRow('Break Reminders', 'Notify to stretch when a focus session ends', <Toggle checked={true} onChange={() => {}} />)}

            <div style={sectionLabel}>Analytics Digest</div>
            {settingRow('Weekly Summary', 'Email details of weekly productivity stats', <Toggle checked={notifSettings.weeklyReport} onChange={() => updateNotifSetting('weeklyReport', !notifSettings.weeklyReport)} />)}
            {settingRow('Rule-based Assistant', 'Allow simulator notifications and reports', <Toggle checked={notifSettings.aiInsights} onChange={() => updateNotifSetting('aiInsights', !notifSettings.aiInsights)} />)}
          </div>
        );

      case 'productivity':
        return (
          <div>
            <div style={sectionLabel}>Timer Operations</div>
            {settingRow('Auto-Focus Mode', 'Launch timer when a task status is set in progress', <Toggle checked={prodSettings.autoFocus} onChange={() => updateProdSetting('autoFocus', !prodSettings.autoFocus)} />)}
            {settingRow('Stand Reminders', 'Alert to stand up during break cycles', <Toggle checked={prodSettings.breakReminders} onChange={() => updateProdSetting('breakReminders', !prodSettings.breakReminders)} />)}

            <div style={sectionLabel}>Duration Configurations</div>
            {[
              { label: 'Focus Session', key: 'pomodoroLength', unit: 'min', min: 10, max: 60 },
              { label: 'Short Break', key: 'shortBreak', unit: 'min', min: 3, max: 15 },
              { label: 'Long Break', key: 'longBreak', unit: 'min', min: 10, max: 30 },
              { label: 'Daily Completion Goal', key: 'dailyGoal', unit: 'tasks', min: 1, max: 20 },
            ].map(setting => (
              <div key={setting.key} style={{ padding: '14px 0', borderBottom: `1px solid ${t.borderSubtle}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, color: t.text }}>{setting.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: t.primary }}>{(prodSettings as any)[setting.key]} {setting.unit}</span>
                </div>
                <input type="range" min={setting.min} max={setting.max}
                  value={(prodSettings as any)[setting.key]}
                  onChange={e => updateProdSetting(setting.key, Number(e.target.value))}
                  style={{ width: '100%', accentColor: t.primary }}
                />
              </div>
            ))}
          </div>
        );

      case 'security':
        return (
          <div>
            <div style={sectionLabel}>Password Management</div>
            {['Current Password', 'New Password', 'Confirm Password'].map(field => (
              <div key={field} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 5 }}>{field}</div>
                <input type="password" placeholder="••••••••" style={inputStyle} />
              </div>
            ))}
            <button style={{ marginTop: 8, background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', border: 'none', borderRadius: 10, padding: '10px 24px', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 14px rgba(139,92,246,0.4)', width: isMobile ? '100%' : 'auto' }}>
              Update Password
            </button>

            <div style={sectionLabel}>Two-Factor Security</div>
            {settingRow('Enable 2FA', 'Require verification codes alongside passwords', <Toggle checked={false} onChange={() => {}} />)}

            <div style={sectionLabel}>Session Log</div>
            <div style={{ padding: '14px', background: isDark ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.04)', borderRadius: 12, border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 14, color: t.text, marginBottom: 4 }}>Active Session</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>Local Host · Active Browser · Active now</div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div>
            <div style={sectionLabel}>Subscription Details</div>
            <div style={{ padding: '20px', background: 'linear-gradient(135deg,rgba(139,92,246,0.1),rgba(99,102,241,0.08))', borderRadius: 14, border: `1px solid ${t.border}`, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row', gap: 12, textAlign: isMobile ? 'center' : 'left' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>Pro Workspace</div>
                  <div style={{ fontSize: 13, color: t.textMuted, marginTop: 2 }}>$12/month · Local Mock Payment</div>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: 20, background: 'linear-gradient(135deg,#8B5CF6,#A855F7)', color: 'white', fontSize: 12, fontWeight: 700 }}>PRO</span>
              </div>
            </div>

            <div style={sectionLabel}>Data Sandbox</div>
            {[
              { icon: Download, label: 'Export Task Data', sub: 'Download JSON snapshot of tasks & focus sessions', color: t.primary },
              { icon: Trash2, label: 'Reset Workspace', sub: 'Wipe all localStorage entries and tasks', color: '#EF4444' },
            ].map(action => (
              <button
                key={action.label}
                onClick={() => {
                  if (action.label === 'Reset Workspace') {
                    if (confirm('Are you sure you want to clear your local database?')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  } else {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href",     dataStr);
                    downloadAnchor.setAttribute("download", "avora_workspace_backup.json");
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                  }
                }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px', borderRadius: 12,
                  background: 'transparent', border: `1px solid ${action.color === '#EF4444' ? 'rgba(239,68,68,0.2)' : t.border}`,
                  cursor: 'pointer', marginBottom: 10, transition: 'all 0.2s', color: action.color, textAlign: 'left',
                }}
              >
                <action.icon size={16} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{action.label}</div>
                  <div style={{ fontSize: 12, color: t.textMuted, marginTop: 1 }}>{action.sub}</div>
                </div>
                <ChevronRight size={14} style={{ color: t.textDim }} />
              </button>
            ))}
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '220px 1fr', gap: 22 }}>
      {/* Settings Navigation Sidebar */}
      <div style={{ ...card, padding: '12px', height: 'fit-content' }}>
        <div style={{ padding: '8px 10px', marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: t.textDim, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Settings</div>
        </div>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: 3, overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? 8 : 0 }}>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: 10, cursor: 'pointer', border: 'none', marginBottom: isMobile ? 0 : 3, textAlign: 'left',
                background: activeSection === s.id ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : 'transparent',
                color: activeSection === s.id ? 'white' : t.textMuted,
                boxShadow: activeSection === s.id ? '0 4px 14px rgba(139,92,246,0.35)' : 'none',
                transition: 'all 0.2s', fontSize: 13, fontWeight: activeSection === s.id ? 600 : 400,
                whiteSpace: 'nowrap',
              }}
            >
              <s.icon size={15} /> {!isMobile && s.label}
            </button>
          ))}
        </div>

        {/* Version branding - Hidden on Mobile sidebar */}
        {!isMobile && (
          <div style={{ padding: '12px 10px', marginTop: 8, borderTop: `1px solid ${t.borderSubtle}` }}>
            <AvoraLogo size="sm" />
            <div style={{ fontSize: 10, color: t.textDim, marginTop: 4 }}>Version 1.0.0 · Build 2026.06</div>
          </div>
        )}
      </div>

      {/* Settings Panel Content */}
      <div style={{ ...card, padding: isMobile ? '20px 16px' : '28px 30px' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 4 }}>
          {sections.find(s => s.id === activeSection)?.label}
        </div>
        <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 24 }}>
          Manage your {activeSection} preferences and settings.
        </div>
        {renderSection()}
      </div>
    </div>
  );
}
