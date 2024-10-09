
const globalFetch = (
    input: RequestInfo,
    init?: RequestInit<RequestInitCfProperties>): Promise<Response | null> => {

    let resp: Promise<Response> = fetch(input, init);
    return resp;
}

export { globalFetch };