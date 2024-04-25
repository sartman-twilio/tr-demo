import {from, interval, Observable} from 'rxjs'
import {filter, map, mergeMap, tap} from 'rxjs/operators'
import {TaskRouterEvent} from '../model/TaskRouterEvent'
import {getEvents} from '../helper/TwilioClientHelper'
import {eventMapper} from '../helper/Mappers'

// Seems to be 'at least once' as some events sneak in twice
const eventSidsSet: Set<string> = new Set<string>()

export const eventSource = (): Observable<TaskRouterEvent> => {
  return interval(500) // request event every second
    .pipe(
      mergeMap(() => getEvents()),
      tap(e => console.log('Events response:', e)),
      mergeMap(events => from(events)), // flat map ob<ev[]> -> ob<ev>
      filter(event => !eventSidsSet.has(event.sid)), // filter if processed
      tap(e => console.log('Raw event:', e)),
      tap(event => eventSidsSet.add(event.sid)), // add to processed list
      map(eventMapper), // map to domain event or null
    ).pipe(
      filter(eventOrNull => !!eventOrNull), // filter null events
      map(event => event as TaskRouterEvent),  // bring type back
      tap(e => console.log('Converted event:', e)),
    )
}