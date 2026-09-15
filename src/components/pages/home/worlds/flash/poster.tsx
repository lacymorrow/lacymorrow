import { Jukebox } from "./jukebox";

/**
 * The still. The same player, holding the first piece on its finished frame,
 * with all 21 rows as links. With JavaScript off this is the whole section and
 * every piece is still reachable.
 */
export const Poster = () => <Jukebox current={0} frame={3} />;

export default Poster;
