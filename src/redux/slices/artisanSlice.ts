import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Artisan {
  artisanId: number;
  companyName?: string;
  experienceYears?: number;
  serviceArea?: string;
  description?: string;
  previousWorkImages?: string;
}

interface ArtisanState {
  selectedArtisan: Artisan | null;
}

const initialState: ArtisanState = {
  selectedArtisan: null,
};

const artisanSlice = createSlice({
  name: "artisan",

  initialState,

  reducers: {
    selectArtisan: (
      state,
      action: PayloadAction<Artisan>
    ) => {
      state.selectedArtisan = action.payload;
    },

    clearSelectedArtisan: (state) => {
      state.selectedArtisan = null;
    },
  },
});

export const {
  selectArtisan,
  clearSelectedArtisan,
} = artisanSlice.actions;

export default artisanSlice.reducer;