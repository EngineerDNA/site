import { useEffect, useState } from 'react';

export default function TerminalCommand() {
  const [platform, setPlatform] = useState<'mac' | 'linux' | 'windows'>('mac');

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('linux')) {
      setPlatform('linux');
    } else if (userAgent.includes('win')) {
      setPlatform('windows');
    }
  }, []);

  const commands: Record<'mac' | 'linux' | 'windows', string> = {
    mac: 'brew install engineerdna/tap/engineerdna',
    linux: 'curl -sL https://engineerdna.com/install.sh | bash',
    windows: 'scoop install engineerdna',
  };

  const platformLabels: Record<'mac' | 'linux' | 'windows', string> = {
    mac: 'macOS',
    linux: 'Linux',
    windows: 'Windows',
  };

  return (
    <div className="rounded-lg border border-border bg-bg-primary shadow-xl">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <span className="ml-2 text-xs text-text-tertiary">Terminal</span>
        </div>
        <div className="flex gap-2">
          {(['mac', 'linux', 'windows'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                platform === p
                  ? 'bg-accent-primary text-white'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              {platformLabels[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 font-mono text-sm">
        <div className="flex items-start gap-2 text-text-secondary">
          <span className="text-accent-primary">$</span>
          <span className="flex-1">{commands[platform]}</span>
        </div>
      </div>
    </div>
  );
}
