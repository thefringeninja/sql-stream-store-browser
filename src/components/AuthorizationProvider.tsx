import React, { ReactNode, StatelessComponent } from 'react';
import getDisplayName from './getDisplayName';

const { Consumer, Provider } = React.createContext<string | undefined>(
    undefined,
);

const AuthorizationProvider: StatelessComponent<{
    authorization: string | undefined;
    children: ReactNode;
}> = ({ authorization, children }) => (
    <Provider value={authorization}>{children}</Provider>
);

export default AuthorizationProvider;

const withAuthorization = () => WrappedComponent => {
    const Component = props => (
        <Consumer>
            {authorization => (
                <WrappedComponent {...props} authorization={authorization} />
            )}
        </Consumer>
    );
    Component.displayName = getDisplayName(
        'WithAuthorization',
        WrappedComponent,
    );
    return Component;
};

export { withAuthorization };