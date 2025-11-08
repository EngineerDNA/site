import { useState, useEffect } from 'react';

const INSTALL_COMMANDS = {
  macOS: 'brew install engineerdna/tap/engineerdna',
  Linux: 'curl -sSL https://get.engineerdna.com | sh',
  Windows: 'winget install EngineerDNA.EngineerDNA',
};

const DOWNLOAD_LINKS = {
  macOS:
    'https://github.com/engineerdna/engineerdna/releases/latest/download/engineerdna-darwin-amd64.tar.gz',
  Linux:
    'https://github.com/engineerdna/engineerdna/releases/latest/download/engineerdna-linux-amd64.tar.gz',
  Windows:
    'https://github.com/engineerdna/engineerdna/releases/latest/download/engineerdna-windows-amd64.zip',
};

type Platform = keyof typeof INSTALL_COMMANDS;

function detectOS(): Platform {
  if (typeof window === 'undefined') return 'macOS';

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform.toLowerCase();

  if (platform.includes('win') || userAgent.includes('windows')) {
    return 'Windows';
  }
  if (platform.includes('linux') || userAgent.includes('linux')) {
    return 'Linux';
  }
  return 'macOS';
}

export default function InstallButton() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('macOS');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSelectedPlatform(detectOS());
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMANDS[selectedPlatform]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="inline-flex flex-col gap-3">
      <div className="flex gap-2">
        {(Object.keys(INSTALL_COMMANDS) as Platform[]).map((platform) => (
          <button
            key={platform}
            onClick={() => setSelectedPlatform(platform)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              selectedPlatform === platform
                ? 'bg-bg-secondary text-text-primary'
                : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
            }`}
          >
            {platform}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-bg-secondary p-4">
        <code className="flex-1 font-mono text-sm text-text-primary">
          {INSTALL_COMMANDS[selectedPlatform]}
        </code>
        <button
          onClick={handleCopy}
          className="rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          aria-label={copied ? 'Copied!' : 'Copy install command'}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
        <span>or</span>
        <a
          href={DOWNLOAD_LINKS[selectedPlatform]}
          className="text-accent-primary transition-colors hover:text-accent-secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download binary directly
        </a>
      </div>
    </div>
  );
}
