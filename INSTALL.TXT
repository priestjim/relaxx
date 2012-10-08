/* --------------------------------------------------------------------
RelaXXPlayer - the easy listening MPD - Web Client

Version: 0.70 Aug -2010

home: http://relaxx.dirk-hoeschen.de
updates: http://sourceforge.net/projects/relaxx

Copyright (C) 2008  Dirk Hoeschen
--------------------------------------------------------------------*/

//==========================//
// Installing RelaXXPplayer //
//==========================//

1: Required tools and programs
==============================
A: Linux or BSD-Server
B: A Web server (I recommend lighttpd)
C: PHP (I recommend php5-cgi)
D: MPD 0.13 or later installed

2: Configure MPD
==============================
If you install MPD with a package-manager, you only
have to point the entry "music_directory" to the directory
where your songs (MP3, WAV) are stored. 
  -> sudo vi /etc/mpd.conf
After rebuilding the database 
  -> sudo mpd --create-db 
and restarting the daemon, 
  -> sudo /etc/init.d/mpd restart
you should be ready to play music with MPD.
For further information's read "man mpd.conf".

!!! The volume-slider will only work with mixer="software" enabled !!!

3: Install RelaxxPlayer
==============================
Just unpack the relaxx-archive into your Web-Root. 
Make sure, that the /config directory is writable by PHP.
If necessary, change user-rights or owner.

The subfolder ./music/ should point to the root directory of your mpd-music
collection (usually /var/lib/mpd/music). That directory must be readable by
the webserver in order to play music in a browser through flash-applet.

2: Configure RelaxxPlayer
==============================
The initial USERNAME is "admin". Leave the PASSWORD field EMPTY.
Once you have opened the "config"-dialog you have basic access to the MPD
connection values and RelaXXPlayer-settings.

 * If the MPD-Daemon is running at the same computer the **HOST** is 127.0.0.1 or localhost
 * The default **PORT** defined in /etc/mpd.conf for MPD is 6600
 * The **PASSWORD** defined in /etc/mpd.conf ist normally empty

In the "rights-select"-dialog, you can choose different rights for non validated
(anonymous) users. So you can configure the player way, that anonymous-users 
are only allowed to add-song (for example). This might be useful for youth clubs 
or bars, where you want to use MPD and RelaXXP as a virtual jukebox.
Initially all rights are enabled.

The columns in playlist and tracklist are customizable since 0.6b
Possible Values are: Artist, Titel, file, Album, Disc, Time, Pos, Track, Name, Genre, Performer, Comment

/=========================//
// Questions / Help       //
//========================//

If you have questions or recommendations please contact me.

email: relaxx@dirk-hoeschen.de
home: "http://dirk-hoeschen.de"

