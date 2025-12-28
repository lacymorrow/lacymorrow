import { AirtableBase, AirtableForm } from "mdx-embed/dist/components/airtable";
import { Buzzsprout } from "mdx-embed/dist/components/buzzsprout";
import { Cinnamon } from "mdx-embed/dist/components/cinnamon";
import { CodePen } from "mdx-embed/dist/components/codepen";
import { CodeSandbox } from "mdx-embed/dist/components/codesandbox";
import { EggheadLesson } from "mdx-embed/dist/components/egghead";
import { Figma } from "mdx-embed/dist/components/figma";
import { Flickr } from "mdx-embed/dist/components/flickr";
import { Gist } from "mdx-embed/dist/components/gist";
import { Instagram } from "mdx-embed/dist/components/instagram";
import { Lbry } from "mdx-embed/dist/components/lbry";
import { LinkedInBadge } from "mdx-embed/dist/components/linkedin";
import { Pin, PinterestBoard, PinterestFollowButton } from "mdx-embed/dist/components/pinterest";
import { Replit } from "mdx-embed/dist/components/replit";
import { SimplecastEpisode } from "mdx-embed/dist/components/simplecast";
import { Snack } from "mdx-embed/dist/components/snack";
import { SoundCloud } from "mdx-embed/dist/components/soundcloud";
import { Spotify } from "mdx-embed/dist/components/spotify";
import { TikTok } from "mdx-embed/dist/components/tiktok";
import { Twitch } from "mdx-embed/dist/components/twitch";
import { Tweet, TwitterFollowButton, TwitterHashtagButton, TwitterList, TwitterMentionButton, TwitterTimeline } from "mdx-embed/dist/components/twitter";
import { Vimeo } from "mdx-embed/dist/components/vimeo";
import { Whimsical } from "mdx-embed/dist/components/whimsical";
import { Wikipedia } from "mdx-embed/dist/components/wikipedia";
import { Wistia } from "mdx-embed/dist/components/wistia";
import { YouTube } from "mdx-embed/dist/components/youtube";

import { Bleed } from 'nextra-theme-docs';
import { Callout, Card, Cards, FileTree, Steps, Tabs } from 'nextra/components';

import { Sandpack } from "@codesandbox/sandpack-react";

import Zoom from 'react-medium-image-zoom';

import FlashArt from '@/components/flash/art';
import Flash from '@/components/flash/flash';
import Readme from '@/components/github/readme';
import Center from "@/components/mdx/center";
import DownloadLink from "@/components/mdx/download-link";
import GithubLink from "@/components/mdx/github-link";
import Thick from "@/components/mdx/thick";
import { View3d } from "@/components/mdx/view-3d";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import Link from "next/link";

import Lead from "@/components/mdx/lead";
import { GitHubLogoIcon } from "@radix-ui/react-icons";


export const componentMap = {
	// React Sandpack live environment
	// https://sandpack.codesandbox.io/
	Sandpack,

	// Image Zoom
	Zoom,

	// Icons
	GitHubLogoIcon,

	// Next
	Link,

	// custom
	Readme,
	Flash,
	FlashArt,
	DownloadLink,
	GithubLink,
	Thick,
	Lead,
	Button,
	Center,
	View3d,

	// ShadCN
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,

	// nextra
	Bleed,
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
