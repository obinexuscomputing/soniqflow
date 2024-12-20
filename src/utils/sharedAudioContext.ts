export class SharedAudioContext {
  private static instance: AudioContext | null = null;

  private constructor() {}

  public static getInstance(): AudioContext {
    if (!SharedAudioContext.instance) {
      SharedAudioContext.instance = new AudioContext();
    }

    if (SharedAudioContext.instance.state === "suspended") {
      SharedAudioContext.instance.resume().catch((err) => {
        console.error("Error resuming AudioContext:", err);
      });
    }

    return SharedAudioContext.instance;
  }

  public static setupResumeListeners(): void {
    const resumeContext = () => {
      if (SharedAudioContext.instance && SharedAudioContext.instance.state === "suspended") {
        SharedAudioContext.instance.resume().catch((err) => {
          console.error("Error resuming AudioContext:", err);
        });
      }
    };

    document.addEventListener("click", resumeContext);
    document.addEventListener("keydown", resumeContext);
  }
}

// Automatically set up listeners
SharedAudioContext.setupResumeListeners();
