RelaXXPlayer - the easy listening MPD - Web Client
==================================================

* [Home](https://github.com/priestjim/relaxx)
* [Original home](http://relaxx.dirk-hoeschen.de)

Copyright (C) 2010 Dirk Hoeschen

Further modifications by Panagiotis Papadomitsos <pj@ezgr.net>

About MPD and RelaXXPlayer
==========================

Music Player Daemon is a soundserver (MP3,OGG WAV) for Linux. MPD is fast and easy to configure. The daemon is controlled by a set of commands over TCPIP. So MPD can even stream sound over the Internet. Meanwhile there are dozens of Clients for MPD. Some are plugins, some are graphical clients, some are web-based. Because I found, that non of
the web-based clients are useful, I decided to make my own player. The first result is RelaXXPlayer.

RelaXXPlayer has the following specifications:

* Massive use of asynchronous http-calls (AJAX) and javascript
* Easy and fast interface with maximum oversight
* Custom skins and multiple languages
* Accessible from all computers in the network

RelaXXPlayer is compatible with

* Firefox > 1.5 
* IE > 6 
* Opera > 9 
* Safari > 3.04

!!! Opera users must press ALT-RMB to view the context menues

Usage of the Web Client
=======================

1. Install RelaXXP (see INSTALL.md)
2. Open player in browser (http://<your-server>/relaxx or http://<your-server> if you installed the UI in the root directory of your virtual host)
3. Use mouse or keyboard to control the player.

## Mouse

The interface is as structured and simple as possible.

You see a layout with 3 regions. The 3 main regions (parts) are resizable.

1. The current PLAYLIST.
2. The DIRECTORY with foldertree-, search-, and playlist-tab.
3. The TRACKLIST listing folder- and playlist-content or searchresult.

If the mousepointer is over PLAYLIST or TRACKLIST-table you can open a context-sensitive MENU with the right mousebutton.

* A doubleclick on a track in the TRACKLIST-table adds the entry to the playlist.
* A doubleclick on a track in the PLAYLIST-table plays that song.
* Shift and mouseclick selects a range between two rows.

## Keyboard

Most of the commands are accessible by keyboard for your comfort.

* `[1]` = play previous track
* `[2]` = toggle (Pause/PLAY)
* `[3]` = play next track
* `[q]` = decrease volume by 5
* `[w]` = increase volume by 5

Some of the key-commands are also context-sensitive and only available, if the mousepointer highlights a track over the PLAYLIST or TRACKLIST-table.

* `[s,a,Ctrl+a]` = select all entries in the PLAYLIST or TRACKLIST
* `[d,ESC]` = deselect select all entries in the PLAYLIST or TRACKLIST
* `[i]` = show filename with path
* `[a]` = add internet radio stream to the playlist (URL)
* `[b]` = play file or strem in local browser unsing a flash applet (eperimental)
* `[space]` = append all selected tracks to the PLAYLIST

Playlist only:

* `[DEL]` = remove selected/hovered - track(s)
* `[up]` = move the track UP in playlist
* `[down]` = move the track DOWN in playlist
* `[o]` = remove old entries 
* `[c]` = clear playlist and stop playing
* `[n]` = save current playlist

## Drag and Drop

Drag and drop is enabled Since 0.5b. Selected songs can be dragged from TRACKLIST to PLAYLIST. The PLAYLIST can be sorted by dragging a song from one position to another.

## Configuring RelaXX

For further information's look into INSTALL.md

Recommendations / Help
======================

If you have recommendations, bugs, templates or new language translations, please contact me or the original author.

* [MPD-Website](http://www.musicpd.org)
* [MPD-Wiki](http://mpd.wikia.com/wiki/Main_Page)

External Tools & Libraries
==========================

RelaXX uses one of the most powerful and sophisticated Javascript-library called "mootools", to handle effects and the access to objects, classes and http-requests. At the server-side, it uses the library MPD::PHP to communicate with MPD.

* [Mootools-Website](http://mootools.net)

Credits
=======

Thanks to the following people.

* Eric van der Sanden : Dutch language file
* Matthieu Simon: French language file
* Roman Verbitskiy: Russian language file
* Edward Who: Chinese language filename
