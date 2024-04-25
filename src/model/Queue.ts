import {Worker} from './Worker'

export type Queue = {
  sid: string,
  name: string,
  workers: Worker[]
}