# ANTWU live-site audit — redesign contract

Source reviewed: `https://antwu.org.np/` and its linked public routes on 2026-09-02.

## Brand signals

- Dominant UI blue: `#0c3c85`.
- Heading/nav navy: `#000080` and `#0b1f6d`.
- Neutral system: white, black, `#333`, and muted gray/blue text.
- Flag accent: red-orange around `#ff5e14`, with deeper reds in the flag artwork.
- The live `main_logo.png` request is currently broken; the available flag artwork is preserved locally as `public/assets/antwu-brand.jpg` and the introduction image as `public/assets/antwu-introduction.jpg`.

## Navigation and route inventory

- Home: `/`.
- About menu: `/render_about`, `/orgnizationchart`, `/render_central_members`, `/render_province_members`, `/render_district_members`, `/render_unit_members`, `/render_campus_members`, `/render_chairperson`.
- Documents: `/render_rules`, `/render_directot`, `/render_publication`.
- Other downloads: `/render_notice`, `/render_press`, `/render_tender`, `/render_news`, `/render_other`.
- Gallery: `/render_images`, `/render_videos`.
- Statistics/activity: `/render_youthactivity`, `/render_youthstats`.
- Blog: `/render_all_posts`.
- Contact: `/portal/contact_page`.
- Membership: `/registermember`.

## Shared behaviors

- Utility/header layer exposes social links, office address, phone, email, membership CTA, EN/NE switching, and a responsive hamburger menu.
- Desktop uses hover dropdown menus; mobile uses a slide/open menu with nested groups.
- Every page repeats the shared footer with contact blocks, Useful Links, Important links, social links, copyright, and developer credit.
- Language switching preserves the current route through `?change_language=en|ne`.

## Page-specific behaviors

- Home: hero carousel with Previous/Next controls; intro/about preview with “Read more”; embedded Facebook block; gallery, video, blog preview blocks; contact form.
- About: rich organization introduction plus Vision, Goal, Values, Mission cards; social/share controls.
- Organization chart: chart/image view.
- Central committee: paginated member directory.
- Province, district, and unit committees: filter form; province dropdown lists Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim.
- International committee and chairperson message: dedicated editorial/member pages.
- Rules/directives/publications/notices/press/tenders/news/other: category-specific listing pages with downloadable content when records exist.
- Photo gallery: image listing page; video gallery: video listing page.
- Activities/statistics: dedicated listing/data pages.
- Blog: listing page and individual post links.
- Contact: map iframe plus required NAME, EMAIL, Phone No., MESSAGE and “Let’s Connect” submit.
- Membership: three-tab workflow with identity/contact fields, marital status, parent name, social security choice, Nepali date, committee, blood group, education, province/district, minimum labor choice, levy, issue date, position, work route, ID/license number, multi-file ID/license upload, optional receipt, and required profile photo; Previous/Next/Submit controls.

## Redesign acceptance

Keep the route/function contract above intact while replacing the Nicepage-style presentation with a professional, accessible ANTWU system: royal-blue/navy foundation, white space, red-orange action/alert accents, structured cards, clear nested navigation, readable Devanagari typography, real imagery, responsive layout, visible form states, and no horizontal overflow.

