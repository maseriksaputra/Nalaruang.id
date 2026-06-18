import { create } from 'zustand';

const useUIStore = create((set) => ({
    snapLines: [],
    setSnapLines: (lines) => set({ snapLines: lines }),
    isSaving: false,
    setIsSaving: (val) => set({ isSaving: val }),
    isDrawingPath: false,
    setIsDrawingPath: (val) => set({ isDrawingPath: val }),
    currentPathPoints: [],
    setCurrentPathPoints: (points) => set({ currentPathPoints: points }),
    isRightSidebarOpen: true,
    setIsRightSidebarOpen: (val) => set({ isRightSidebarOpen: val }),
    assetSelectionTarget: null,
    setAssetSelectionTarget: (target) => set({ assetSelectionTarget: target }),
    timelineHeight: 250,
    setTimelineHeight: (height) => set({ timelineHeight: height }),
    isTimelineOpen: true,
    setIsTimelineOpen: (isOpen) => set({ isTimelineOpen: isOpen })
}));

export default useUIStore;

