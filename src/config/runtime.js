// Runtime detection config
export const RUNTIME = (() => {
  const detectors = [
    {
      name: 'browser',
      test: () => typeof window !== 'undefined' && typeof document !== 'undefined',
      priority: 1
    },
    {
      name: 'node',
      test: () => typeof process !== 'undefined' && process.versions && process.versions.node,
      priority: 2
    },
    {
      name: 'deno',
      test: () => typeof Deno !== 'undefined',
      priority: 3
    },
    {
      name: 'bun',
      test: () => typeof Bun !== 'undefined',
      priority: 4
    }
  ];

  detectors.sort((a, b) => a.priority - b.priority);
  
  for (const detector of detectors) {
    try {
      if (detector.test()) {
        return {
          platform: detector.name,
          version: detector.name === 'node' ? process.version :
                  detector.name === 'browser' ? navigator.userAgent :
                  'unknown',
          timestamp: Date.now()
        };
      }
    } catch (e) {
      continue;
    }
  }
  
  return { platform: 'unknown', version: 'unknown', timestamp: Date.now() };
})();

export default RUNTIME;
