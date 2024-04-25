export type TrQueue = {
  sid: string,
  friendly_name: string,
  target_workers: string
}

export type TaskQueuesResponse = {
  task_queues: TrQueue[]
}

export type WorkersResponse = {
  workers: TrWorker[]
}

export type TrWorker = {
  sid: string,
  friendly_name: string,
  attributes: string,
  available: boolean,
  activity_sid: string,
  activity_name: string
}

export type TrChannel = {
  available: boolean,
  task_channel_sid: string,
  configured_capacity: number
}

export type ChannelsResponse = {
  channels: TrChannel[]
}

export type TrTaskChannel = {
  sid: string,
  unique_name: string
}

export type TaskChannelsResponse = {
  channels: TrTaskChannel[]
}

export type TrActivitiesResponse = {
  activities: TrActivity[]
}

export type TrActivity = {
  friendly_name: string,
  sid: string,
  available: boolean
}

export type TaskResponse = {
  sid: string
}

export type EventsResponse = {
  events: TrEvent[]
}

export type TrEvent = {
  sid: string,
  event_date_ms: number,
  event_data: any,
  event_type: string
}

