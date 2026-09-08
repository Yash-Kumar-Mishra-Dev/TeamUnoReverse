import React from 'react';
import { FolderArchive, ExternalLink, FileCode } from 'lucide-react';

export const StitchAssetsPanel: React.FC = () => {
  const assets = [
    { name: '1. RakshaSetu_Frontend_Master_Prompt.md', file: 'stitch_assets/RakshaSetu_Frontend_Master_Prompt.md', desc: 'Frontend master prompt specification.' },
    { name: '2. Design System Tokens', file: 'src/index.css', desc: 'Integrated color tokens, typography & clean UI rules.' },
    { name: '3. RakshaSetu Shield Logo SVG', file: 'stitch_assets/RakshaSetu_Shield_Logo.svg', desc: 'Vector SVG logo & screenshot asset.' },
    { name: '4. Government Command Center HTML', file: 'stitch_assets/Government_Command_Center_Overview_Dashboard.html', desc: 'Stitch generated overview dashboard HTML.' },
    { name: '5. RakshaSetu_Master_Prompt_v2.md', file: 'stitch_assets/RakshaSetu_Master_Prompt_v2.md', desc: 'Consolidated SRS v2 master build prompt.' },
    { name: '6. Field Responder Tactical Ops HUD', file: 'stitch_assets/Field_Responder_Tactical_Ops_HUD.html', desc: 'Dark theme tactical HUD code & screenshot.' },
    { name: '7. Citizen Emergency Safety App', file: 'stitch_assets/RakshaSetu_Citizen_Emergency_Safety_App.html', desc: 'Mobile-first emergency app layout.' },
    { name: '8. Citizen Panel Dashboard', file: 'stitch_assets/RakshaSetu_Citizen_Panel_Dashboard.html', desc: 'Desktop citizen panel dashboard layout.' },
    { name: '9. Admin Platform Control Overview', file: 'stitch_assets/Admin_Platform_Control_Overview_Dashboard.html', desc: 'Admin overview dashboard code.' }
  ];

  return (
    <div className="flex-1 bg-[#12181F] text-slate-100 p-6 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-amber-400 font-mono text-xs font-bold flex items-center gap-1.5">
              <FolderArchive className="w-4 h-4" /> STITCH PROJECT: CLEAN UI REFINEMENT (ID: 14524892580037120383)
            </span>
            <h2 className="text-xl font-bold font-heading text-white mt-1">Downloaded Project Assets & Screen Specifications</h2>
          </div>
          <a
            href="stitch_assets/RakshaSetu_Master_Prompt_v2.md"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
          >
            View Master Prompt v2
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          {assets.map((item, idx) => (
            <div key={idx} className="bg-[#171E29] p-4 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="text-amber-400 font-bold flex items-center gap-1">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{item.name}</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1 font-sans">{item.desc}</p>
              </div>
              <a
                href={item.file}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 font-bold hover:underline flex items-center gap-1 pt-2 text-[11px]"
              >
                <span>Open File</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
