export class SharedAudioContext {
    private static instance: AudioContext | null = null;
  
    // Private constructor to prevent direct instantiation
    private constructor() {}
  
    // Static method to initialize and get the shared AudioContext
    public static getInstance(): AudioContext {
      if (!SharedAudioContext.instance) {
        SharedAudioContext.instance = new AudioContext();
        SharedAudioContext.setupResumeListeners();
      }
  
      return SharedAudioContext.instance;
    }
  
    // Static method to add event listeners for resuming the AudioContext
    public static setupResumeListeners(): void {
      const resumeContext = () => {
        if (SharedAudioContext.instance && SharedAudioContext.instance.state === "suspended") {
          SharedAudioContext.instance.resume().catch((err) => {
            console.error("Error resuming AudioContext:", err);
          });
        }
      };
  
      document.addEventListener("click", resumeContext, { once: true });
      document.addEventListener("keydown", resumeContext, { once: true });
    }
  }
  
  // Setup listeners on import
  SharedAudioContext.setupResumeListeners();
  