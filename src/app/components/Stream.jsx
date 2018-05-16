import React from 'react';
import urljoin from 'url-join';
import { Observable as obs } from 'rxjs';
import { 
    Table, 
    TableBody, 
    TableRow, 
    TableRowColumn, 
    TableHeader, 
    TableHeaderColumn,
    Dialog } from 'material-ui';
import { Link } from 'react-router-dom';
import { createState, connect } from '../reactive';
import { resolveLinks, getServerUrl } from '../utils';
import { rels, actions, store } from '../stream-store';
import NavigationLinks from './NavigationLinks.jsx';
import mount from './mount';

const messages$ = store.body$
    .zip(store.url$)
    .map(([{ _embedded }, url]) => () => _embedded[rels.message]
        .map(({ _links, ...message }) => ({
            ...message,
            _links: resolveLinks(url, _links)
        })));

const state$ = createState(
    obs.merge(
        store.links$.map(links => ['links', links]),
        messages$.map(messages => ['messages', messages])
    ),
    obs.of({ messages: [], links: {} }));


const Message = ({ messageId, createdUtc, payload, position, streamId, streamVersion, type, _links, server }) => (
    <TableRow>
        <TableRowColumn>{messageId}</TableRowColumn>
        <TableRowColumn>{createdUtc}</TableRowColumn>
        <TableRowColumn>{type}</TableRowColumn>
        <TableRowColumn style={{width: '100%'}}>
            <Link rel='self' to={`/server/streams/${streamId}/${streamVersion}?server=${server}`}>{streamId}@{streamVersion}</Link>
        </TableRowColumn>
        <TableRowColumn>{position}</TableRowColumn>
    </TableRow>);

const Messages = ({ messages, server }) => (
    <Table selectable={false} fixedHeader={false} style={{ tableLayout: 'auto' }}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
                <TableHeaderColumn>Message Id</TableHeaderColumn>
                <TableHeaderColumn>Created UTC</TableHeaderColumn>
                <TableHeaderColumn>Type</TableHeaderColumn>
                <TableHeaderColumn style={{width: '100%'}}>Stream Id@Version</TableHeaderColumn>
                <TableHeaderColumn>Position</TableHeaderColumn>
            </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false} stripedRows>
            {messages.map(message => (<Message key={message.messageId} {...message} server={server} />))}
        </TableBody>
    </Table>);

Messages.defaultProps = {
    messages: []
};

const onNavigate = href => actions.get.next(href);

const Stream = ({ links, messages, location }) => (
    <section>
        <NavigationLinks 
            onNavigate={onNavigate}
            links={links} />
        <Messages messages={messages} server={getServerUrl(location)} />
    </section>);

Stream.defaultProps = {
    links: { }
};

export default getBookmark => mount(props => actions.get.next(getBookmark(props)))(connect(state$)(Stream));