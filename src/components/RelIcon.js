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
    Search,
    SqlStreamStore,
} from './Icons';
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
    [rels.find]: Search,
};

const RelIcon = ({ rel, ...props }) =>
    createElement(fontIconByRel[rel] || SqlStreamStore, props);

export default RelIcon;
