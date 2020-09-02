import * as _ from "lodash"
import * as React from "react"

export type ScaleByFactor = (value: number, factor?: number) => number;
export type ScaleByBreakpoints = (
  values: readonly [number, number, number, number],
) => number;

export interface Responsive {
  scaleByFactor: ScaleByFactor,
  scaleByBreakpoints: ScaleByBreakpoints
  responsiveHorizontal: number
}

export const ResponsiveContext = React.createContext<Responsive>({
  scaleByFactor: (value: number) => value,
  scaleByBreakpoints: (values: readonly [number, number, number, number]) => values[0],
  responsiveHorizontal: 16
})
