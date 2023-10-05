import { AirtableBase, AirtableForm } from "mdx-embed/dist/components/airtable";
import { Buzzsprout } from "mdx-embed/dist/components/buzzsprout";
import { Cinnamon } from "mdx-embed/dist/components/cinnamon";
import { CodePen } from "mdx-embed/dist/components/codepen";
import { CodeSandbox } from "mdx-embed/dist/components/codesandbox";
import { EggheadLesson } from "mdx-embed/dist/components/egghead";
import { Figma } from "mdx-embed/dist/components/figma";
import { Flickr } from "mdx-embed/dist/components/flickr";
import { Gist } from "mdx-embed/dist/components/gist";
import { Pin, PinterestBoard, PinterestFollowButton } from "mdx-embed/dist/components/pinterest";
import { Instagram } from "mdx-embed/dist/components/instagram";
import { Lbry } from "mdx-embed/dist/components/lbry";
import { LinkedInBadge } from "mdx-embed/dist/components/linkedin";
import { Replit } from "mdx-embed/dist/components/replit";
import { SimplecastEpisode } from "mdx-embed/dist/components/simplecast";
import { Snack } from "mdx-embed/dist/components/snack";
import { SoundCloud } from "mdx-embed/dist/components/soundcloud";
import { Tweet, TwitterFollowButton, TwitterHashtagButton, TwitterList, TwitterMentionButton, TwitterTimeline } from "mdx-embed/dist/components/twitter";
import { Spotify } from "mdx-embed/dist/components/spotify";
import { TikTok } from "mdx-embed/dist/components/tiktok";
import { Twitch } from "mdx-embed/dist/components/twitch";
import { Vimeo } from "mdx-embed/dist/components/vimeo";
import { Whimsical } from "mdx-embed/dist/components/whimsical";
import { Wikipedia } from "mdx-embed/dist/components/wikipedia";
import { Wistia } from "mdx-embed/dist/components/wistia";
import { YouTube } from "mdx-embed/dist/components/youtube";

import { Callout, Card, Cards, FileTree, Steps, Tabs } from 'nextra/components'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button'
import Readme from '@/components/github/readme'
import Flash from '@/components/flash/flash'
import FlashArt from '@/components/flash/art'
import Thick from "@/components/mdx/thick";
import Center from "@/components/mdx/center";
import GithubLink from "@/components/mdx/github-link";


export const componentMap = {
	// custom
	Readme,
	Flash,
	FlashArt,
	GithubLink,
	Thick,
	Button,
	Center,

	// ShadCN
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,

	Button,

	// nextra
	Callout,
	Card,
	Cards,
	FileTree,
	Steps,
	Tabs,

	// mdx-embed
	AirtableBase,
	AirtableForm,
	Buzzsprout,
	Cinnamon,
	CodePen,
	CodeSandbox,
	EggheadLesson,
	Figma,
	Flickr,
	Gist,
	Instagram,
	Lbry,
	PinterestFollowButton,
	LinkedInBadge,
	Pin,
	PinterestBoard,
	Replit,
	SimplecastEpisode,
	Snack,
	SoundCloud,
	Spotify,
	TwitterFollowButton,
	TikTok,
	Twitch,
	TwitterMentionButton,
	Tweet,
	TwitterHashtagButton,
	TwitterList,
	TwitterTimeline,
	Vimeo,
	Whimsical,
	Wikipedia,
	Wistia,
	YouTube,
}
