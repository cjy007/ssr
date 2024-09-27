
const globalFetch = (
    input: RequestInfo,
    init?: RequestInit<RequestInitCfProperties>): Promise<Response> => {

    return fetch(input, init);
}

export { globalFetch };