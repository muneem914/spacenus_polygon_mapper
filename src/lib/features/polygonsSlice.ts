import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Polygon {
  id: string;
  label: string;
  coordinates: [number, number][];
  fillColor: string;
  boundaryColor: string;
  area?: number;
  center?: [number, number];
}

interface PolygonsState {
  polygons: Polygon[];
}

const initialState: PolygonsState = { polygons: [] };

const polygonsSlice = createSlice({
  name: "polygons",
  initialState,
  reducers: {
    // new polygon adding function
    addPolygon: (state, action: PayloadAction<Polygon>) => {
      state.polygons.push(action.payload);
    },
    // polygon update function (not working)
    updatePolygon: (state, action: PayloadAction<{
      id: string;
      label?: string;
      fillColor?: string;
      boundaryColor?: string;
      coordinates?: [number, number][];
    }>) => {
      const index = state.polygons.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.polygons[index] = {
          ...state.polygons[index],
          ...action.payload
        };
      }
    },

    // delete polygon by id
    deletePolygon: (state, action: PayloadAction<string>) => {
      state.polygons = state.polygons.filter((p) => p.id !== action.payload);
    },

    // polygon new state for imported json data
    setPolygons(state, action: PayloadAction<Polygon[]>) {
      state.polygons = action.payload;
    },
  },
});

export const { addPolygon, updatePolygon, deletePolygon, setPolygons } = polygonsSlice.actions;
export default polygonsSlice.reducer;
