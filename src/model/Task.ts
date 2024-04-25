export enum TaskStatus {
  InQueue = 'InQueue',
  Reserved = 'Reserved',
  Assigned = 'Assigned',
  Completed = 'Completed'
}

export interface Task {
  status: TaskStatus,
  sid: string,
  priority: number,
  attributes: string,
}

export class InQueueTask implements Task {
  status = TaskStatus.InQueue

  constructor(
    readonly sid: string,
    readonly priority: number,
    readonly attributes: string,
    readonly queueSid: string,
  ) {
  }
}

export class ReservedTask implements Task {
  status = TaskStatus.Reserved

  constructor(
    readonly sid: string,
    readonly priority: number,
    readonly attributes: string,
    readonly reservationSid: string,
    readonly workerSid: string,
    readonly reservationActionRequested: boolean = false,
  ) {
  }
}

export class AssignedTask implements Task {
  status = TaskStatus.Assigned

  constructor(
    readonly sid: string,
    readonly priority: number,
    readonly attributes: string,
    readonly workerSid: string,
    readonly completionRequested: boolean = false,
  ) {
  }
}

export class CompletedTask implements Task {
  status = TaskStatus.Completed

  constructor(
    readonly sid: string,
    readonly priority: number,
    readonly attributes: string,
    readonly workerSid: string,
  ) {
  }
}