import { Jukebox } from "./jukebox";
import { POSTER_INDEX } from "./pieces";

/**
 * The still. The same player, holding one chosen piece on its finished frame,
 * with all 21 rows as links. With JavaScript off this is the whole section and
 * every piece is still reachable. The piece is a constant and never random:
 * this renders on the server, and a server that guessed differently from the
 * client would warn on hydration and flip the screen under the visitor.
 */
export const Poster = () => <Jukebox current={POSTER_INDEX} frame={3} />;

export default Poster;
