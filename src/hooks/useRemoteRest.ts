import { useState, useEffect } from "react";
import { Contract, ParmenidesError } from "parmenides";
import { loading, failure, success, RemoteData } from "../utils/remote-data/remote-data";
import { Task, UnknownError } from "@ts-task/task";
import { validateContract } from "../utils/parmenides/validate-contract";
import { caseError, isInstanceOf } from "@ts-task/utils";
import { asUnknownError } from "@ts-task/task/dist/lib/src/operators";
import { TaskFetch, fetch } from "@ts-task/fetch";


class ErrorResponse {
    type = 'errorResponse';
    message: string;
    constructor (public response: TaskFetch.Response) {
        this.message = `Can't fetch resource, status code ${response.status}`;
    }
}

class InvalidResponse {
    type = 'invalidResponse';
    message: string;
    constructor (public path: string, public error: ParmenidesError) {
        this.message = `The url (${path}) gave an unexpected response: ${error.getMessage()}`;
    }
}

type RemoteRestState <T> = RemoteData<T, UnknownError | InvalidResponse | ErrorResponse>;
/**
 * This hook will fetch a resource from a Rest API and validate it's response, to ensure
 * you have the expected value.
 * @param path The resource you want to fetch
 * @param contract A contract to validate the response
 * @param watch A list of elements to watch in order to re-make the request
 * @returns A RemoteData with the Data or the Error
 */
export function useRemoteRest<T>(path: string, contract: Contract<T>, watch: any[] = []) {
    // We will hold the component state in this hook
    const [state, setState] = useState<RemoteRestState<T>>(loading);

    useEffect(() =>
      // Fetch the resource
      fetch(path)
        // If the response is not a 200 Ok treat it as an error
        .chain(rejectIfNotOk)
        // Interpret the response as a JSON
        .chain(response => response.json())
        // And validate it using the provided contract
        .chain(validateContract(contract))
        // If the contract is not valid, transform it to an InvalidResponse
        .catch(
            caseError(
                isParmenidesError,
                err => Task.reject(new InvalidResponse(path, err))
            )
        )
        // If we have a TypeError from fetch or json(), treat it as an unknownError
        .catch(
          caseError(
            isInstanceOf(TypeError),
            asUnknownError
          )
        )
        // Once we have the value, or something failed, update the state
        .fork(
            err => setState(failure(err)),
            todo => setState(success(todo)),
        )
    , watch);

    return state;
}

function rejectIfNotOk (response: TaskFetch.Response) {
    if (response.ok) {
        return Task.resolve(response);
    } else {
        return Task.reject(new ErrorResponse(response));
    }
}
function isParmenidesError (error: any): error is ParmenidesError {
    return typeof error === 'object' && 'ParmenidesError' in error;
}
