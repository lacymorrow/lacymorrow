# flash: the player

Supersedes the first version of this spec, which sent the pieces past
the camera on a filmstrip. That reel looked like 2004 and it made
choosing a piece a test of reflexes: each one held the gate for about
three quarters of a second. Two attempts to fix the picking failed,
and the second was worse than the first, because freezing a moving
gallery on hover is a stranger thing to do than never moving it. The
fault was the concept, not the interaction. A gallery you are meant to
browse must not move.

## 1. The person and the moment

A stranger who just read "still plays: Flash art and a Flash music
player" in the list above, scrolling on with mild doubt, and who in the
next ten seconds should see a real piece from that era drawing itself,
believe the line, and be able to open any of the other twenty.

## 2. The one link and the overlay copy

| field | value |
|-------|-------|
| id | `flash` |
| title | Made in Flash |
| line | I drew these with code in Flash years ago, and they still run. |
| href | `/play/art` |
| cta | See the art |
| background | `#06070f` |
| lengthVh | 200 |
| playSeconds | 63 (21 pieces, three seconds each) |
| holdSeconds | 2 |
| budget | `{ assetsKb: 80, triangles: 0 }` |

The overlay sits at the bottom of the panel, which is why the player
carries asymmetric padding: it lives in the top two thirds and leaves
the bottom to the copy.

## 3. The shape of it

One window, in the middle of the screen, drawn like a 2004 media
player: brushed chrome with a bevel, a title bar reading `flashart.swf`,
a screen on the left, a playlist on the right, and a status bar across
the bottom.

Nothing in the window ever moves except the art on the screen.

- **The screen.** A 4:3 well showing one piece drawing itself, through
  the four frames captured at 0.5, 1.5, 3 and 6 seconds, then holding
  on the finished frame.
- **The playlist.** All 21 pieces, numbered, in two columns, every row
  an ordinary link to that piece's page. The one playing carries a
  green bar and green text. Rows never move, reorder, or scroll.
- **The status bar.** The piece's name, `ActionScript`, and
  `open this piece` pointing at the same page as its row.

## 4. How it plays, and how you take over

The timeline walks the playlist: piece `floor(progress * 21)`, three
seconds each, then the world's own loop starts it over at the top.

Pointing at any row previews that piece on the screen and holds the
world's timeline, through `hold(true)` on the stage. That is safe here
in a way it was not in the reel: nothing has moved, so the thing under
the pointer is the thing that was under the pointer. Moving along the
list previews each row in turn. Leaving the window lets go, and the
walk continues from where it stopped rather than skipping ahead.
Keyboard focus previews the same way, because the rows are links and
`:focus` is the keyboard's version of pointing.

A click, a tap, or Enter opens that piece's page. There is no second
tap, no click target that moves, and nothing to aim at.

## 5. Look

Period, committed to on purpose: the glossy chrome gradient and the
bevelled title bar are what a skinnable player looked like, and this
is a section about that era. The rest of the site's rules still hold
inside the window, which is why the type is the site's mono, the
highlight is the one green from the style guide rather than a stock
player blue, and there is no drop shadow with a colour in it.

| token | value | use |
|-------|-------|-----|
| backdrop | `#06070f` | behind the window, and the world's cut colour |
| chrome | `#3a3f47` to `#22262c` | the window's vertical gradient |
| well | `#0c0d11` | the screen before a piece paints |
| rows | `#131519` / `#0f1115` | alternating playlist rows |
| now playing | `#4ade80` | the bar, the row, `open this piece` |
| ink | `#e7e7ea` | row names, piece name |
| dim | `#8b8f97` | numbers, labels |

## 6. Assets and technique

No WebGL. This world is DOM and CSS, which is why it is the cheapest
of the three and the only one whose Poster is the same thing as the
live version.

- 21 atlases under `public/static/play/art/easel/` (about 30 KB each)
  and the same again at `easel-low/` for the low quality tier. One is
  on screen at a time and the next is prefetched during the current
  one, so a full pass costs about 630 KB and arriving costs one file.
- The screen is a background image at `201% 201%`, positioned to one
  of the four quadrants. The extra one percent keeps a scaled WebP
  from showing a sliver of the frame next door along the seam.
- `scripts/capture-flash-art.mjs` writes the atlases through Ruffle.
  Its ribbon sheet and thumbnails are gone with the reel.

## 7. Quality low vs high

`low` swaps the atlas folder for `easel-low` (266x200 frames). That is
the whole difference: there is nothing else in here to turn down.

## 8. The Poster

The same player, holding piece 01 on its finished frame, with all 21
rows as links. With JavaScript off this is the entire section and
every piece is still reachable, which is the strongest version of the
fallback rule in the contract. The stage retires the Poster once the
live copy has faded in, so those 21 links do not sit in the tab order
underneath it.

## 9. Budget

| measure | value |
|---------|-------|
| over the wire on arrival | one atlas, about 30 KB |
| over the wire, full pass | about 630 KB high, 380 KB low |
| world chunk | about 3 KB gzipped |
| triangles | 0 |
| render targets | 0 |

## 10. What was removed

The ribbon and its six swooshes, the 21 flying frames, the easel and
its painting shader, the speed lines, the camera dolly, the parallax,
the raycasting and its bounding-sphere fix, the caption that tracked
the easel across the screen, the coarse-pointer two-tap rule, the
ribbon sheet, and both thumbnail sets. About 1,400 lines of scene code
and 684 KB of committed images.

Also considered and cut: a static 3D wall of all 21 hanging pieces,
and a 2004 desktop of overlapping windows. Both keep the pieces still,
which was the point, but the player is the one that says something
true about Lacy rather than only about the era, and it is the only one
that needs no WebGL.

## 11. Open questions

None blocking. Two worth a look: the pieces play from four still
frames rather than live Ruffle, which is a compromise the old spec
made for a 12.7 MB wasm payload and this one keeps; and `shapes.swf`
has no page of its own, so its row links to `/play/art`.
