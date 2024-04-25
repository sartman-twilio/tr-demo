export type Worker = {
  sid: string,
  name: string,
  capacity: number,
  attributes: string,
  available: boolean,
  availabilityUpdateRequested: boolean
}