import { aggregerStatus } from '../../ducks/utils';

export function selectErPrivatModus(state) {
    const stateData = state.data;
    const situasjonReducer = stateData.situasjon;

    return situasjonReducer.data.underOppfolging === false;
}

export function selectPrivatModusSlice(state) {
    const stateData = state.data;
    const situasjonReducer = stateData.situasjon;
    const identitetReducer = stateData.identitet;

    return {
        status: aggregerStatus(situasjonReducer, identitetReducer),
        data: {
            erPrivatModus: selectErPrivatModus(state),
        },
    };
}

export function selectPrivatModusStatus(state) {
    return selectPrivatModusSlice(state).status;
}
