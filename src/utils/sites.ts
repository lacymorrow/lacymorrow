import { SiteTableData } from "@/types/sites";

export function getOriginalSiteData(site?: SiteTableData | null) {
	if (!site || !site.siteData || !site.siteData.original) {
		return null;
	}

	return site.siteData.original;
}

export function getOrganizations(site?: SiteTableData | null) {
	if (!site?.siteData?.original?.organizations) {
		return null
	}

	return site.siteData.original.organizations.map((o) => o.name).join(", ")
}
