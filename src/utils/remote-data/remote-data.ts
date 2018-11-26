// inspired by http://blog.jenkster.com/2016/06/how-elm-slays-a-ui-antipattern.html

function lit<S extends string> (str: S): S {
    return str;
}

interface NotAsked {
    type: 'not-asked';
};

interface Loading {
    type: 'loading';
}

interface Failure <E> {
    type: 'failure';
    error: E
}

interface Success <T> {
    type: 'success';
    value: T;
}
export type RemoteData <T, E>
    = NotAsked
    | Loading
    | Failure<E>
    | Success<T>
;

export const notAsked = {type: lit('not-asked')};
export const loading = {type: lit('loading')};
export const success = <T>(value: T) => ({type: lit('success'), value});
export const failure = <E>(error: E) => ({type: lit('failure'), error});

function assertNever (obj: never): never {
    throw new Error(`This should never happen ${obj}`);
}

export function match<T, E, B>(
    mapNotAsked: () => B,
    mapLoading: () => B,
    mapFailure: (err: E) => B,
    mapSuccess: (val: T) => B,
    remote: RemoteData<T, E>
): B;

export function match<T, E, B>(
    mapNotAsked: () => B,
    mapLoading: () => B,
    mapFailure: (err: E) => B,
    mapSuccess: (val: T) => B,
): (remote: RemoteData<T, E>) => B;

export function match<T, E, B>(
    mapNotAsked: () => B,
    mapLoading: () => B,
    mapFailure: (err: E) => B,
    mapSuccess: (val: T) => B,
    remote?: RemoteData<T, E>
): any
{
    const resolve = (r: RemoteData<T, E>) => {
        switch (r.type) {
            case 'success': return mapSuccess(r.value);
            case 'failure': return mapFailure(r.error);
            case 'not-asked': return mapNotAsked();
            case 'loading': return mapLoading();
            default: return assertNever(r);
        }
    }

    if (typeof remote === 'undefined') {
        return resolve;
    } else {
        return resolve(remote);
    }
}