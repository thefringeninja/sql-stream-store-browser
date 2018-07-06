import React, { createElement } from 'react';
import {
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
} from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Observable as obs } from 'rxjs';
import {
    mount,
    Notifications,
    FormButtons,
    NavigationLinks,
} from './components';
import {
    SqlStreamStore,
} from './components/Icons';
import {
    actions,
    store,
    rels,
    views,
} from './stream-store';
import theme from './theme';
import { createState, connect } from './reactive';

const empty = () => null;

const getSelfAlias = links => Object
    .keys(links)
    .filter(rel => rel.indexOf('streamStore:') === 0)
    .filter(rel => links[rel].href === links.self.href)[0];

const self$ = store.links$
    .filter(links => links.self)
    .map(getSelfAlias)
    .filter(rel => !!rel);

const state$ = createState(
    obs.merge(
        self$.map(self => ['self', () => self]),
        store.links$.map(links => ['links', () => links]),
        store.forms$.map(forms => ['forms', () => forms]),
    ), obs.of({ links: {}, forms: {} }),
);

const initialNavigation = () => actions.get.next({ url: window.location.href });

const onNavigate = url => actions.get.next({ url });

const Hero = () => (
    <AppBar position={'static'} color={'default'}>
        <Toolbar>
            <SqlStreamStore />
            <Typography variant={'title'} color={'inherit'}>
                Sql Stream Store
            </Typography>
        </Toolbar>
    </AppBar>);

const SqlStreamStoreBrowser = ({ self, links, forms }) => (
    <MuiThemeProvider theme={theme}>
        <div>
            <CssBaseline />
            <Hero />
            <section>
                <NavigationLinks
                    onNavigate={onNavigate}
                    links={links}
                />
                <FormButtons
                    actions={{
                        [rels.append]: actions.post,
                        [rels.metadata]: actions.post,
                        [rels.delete]: actions.delete,
                    }}
                    forms={forms}
                />
                {createElement(views[self] || empty, {
                    links,
                    forms,
                    self,
                    onNavigate,
                })}
            </section>
            <Notifications />
        </div>
    </MuiThemeProvider>);

export default mount(initialNavigation)(connect(state$)(SqlStreamStoreBrowser));