RelaXXPlayer - the easy listening MPD - Web Client
==================================================

* [Home](https://github.com/priestjim/relaxx)
* [Original home](http://relaxx.dirk-hoeschen.de)

Copyright (C) 2010 Dirk Hoeschen
Further modifications by Panagiotis Papadomitsos <pj@ezgr.net>

Installing RelaXXPplayer
========================

## 1. Required tools and programs

* Linux or BSD-Server
* A Web server (I recommend lighttpd)
* PHP (I recommend php5-cgi)
* MPD 0.13 or later installed

## 2. Configure MPD

If you install MPD with a package-manager, you only have to point the entry "music_directory" to the directory where your songs (MP3, WAV) are stored. 
		
		sudo vi /etc/mpd.conf

After rebuilding the database 
		
		sudo mpd --create-db 

and restarting the daemon, 
		
		sudo /etc/init.d/mpd restart

you should be ready to play music with MPD. For further information's read "man mpd.conf".

!!! The volume-slider will only work with mixer="software" enabled !!!

## 3: Install RelaxxPlayer

Just unpack the relaxx-archive into your Web-Root. Make sure, that the /config directory is writable by PHP. If necessary, change user-rights or owner.

The subfolder ./music/ should point to the root directory of your mpd-music collection (usually /var/lib/mpd/music). That directory must be readable by the webserver in order to play music in a browser through flash-applet.

Configuring RelaxxPlayer
========================

Once you have opened the "config"-dialog you have basic access to the MPD connection values and RelaXXPlayer-settings.

* If the MPD-Daemon is running at the same computer the **HOST** is 127.0.0.1 or localhost
* The default **PORT** defined in /etc/mpd.conf for MPD is 6600
* The **PASSWORD** defined in /etc/mpd.conf ist normally empty

The columns in playlist and tracklist are customizable since 0.6b
Possible Values are: Artist, Title, File, Album, Disc, Time, Pos, Track, Name, Genre, Performer, Comment

Questions / Help
================

If you have questions or recommendations please contact me or the original author.
