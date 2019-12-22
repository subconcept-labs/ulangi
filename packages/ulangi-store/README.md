# @ulangi/ulangi-store

This is a state management of Ulangi app. It contains all global observables. The value of these observables should be mutated inside reducers only.

### Note:
- There is no reducers for EventState. Event is updated by the EventMiddleware after all reducers have completed.
