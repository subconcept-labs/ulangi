# @ulangi/ulangi-action

This package defines all actions that are used to communicate between sagas, stores and delegates.

Each action must have 2 properties: ```type``` and ```payload```.

- ```ActionType.ts``` defines all possible action types.

- ```ActionPayload.ts``` defines payload of each type.

- ```InferableAction.ts``` has an ```is()``` method which is useful to infer the shape of payload based on action type.



