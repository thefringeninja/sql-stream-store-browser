import { createElement } from 'react';
import {
    Publish,
    Settings,
    DeleteForever,
    FirstPage,
    LastPage,
    ChevronLeft,
    ChevronRight,
    RssFeed,
    Refresh,
} from '@material-ui/icons';
import { SqlStreamStore } from './Icons';
import { rels } from '../stream-store';

const fontIconByRel = {
    [rels.first]: FirstPage,
    [rels.previous]: ChevronLeft,
    [rels.self]: Refresh,
    [rels.next]: ChevronRight,
    [rels.last]: LastPage,
    [rels.feed]: RssFeed,
    [rels.append]: Publish,
    [rels.metadata]: Settings,
    [rels.delete]: DeleteForever,
};

const RelIcon = ({ rel }) =>
    createElement(fontIconByRel[rel] || SqlStreamStore, { color: 'action' });

export default RelIcon;
