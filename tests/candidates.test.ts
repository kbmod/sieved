import { beforeEach, describe, expect, it } from "vitest";
import { extractCandidate, findRendererRoots } from "../src/content/candidates";

describe("YouTube candidate extraction", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    history.replaceState({}, "", "/");
  });

  it("extracts a standard grid card", () => {
    document.body.innerHTML = `
      <ytd-rich-item-renderer>
        <a id="video-title" href="/watch?v=abc123" title="I bought Amazon's CHEAPEST mud motor">ignored</a>
        <ytd-channel-name><a href="/@LukeMcFadden">Luke McFadden</a></ytd-channel-name>
      </ytd-rich-item-renderer>`;
    const root = document.querySelector("ytd-rich-item-renderer")!;
    expect(extractCandidate(root)).toEqual({
      title: "I bought Amazon's CHEAPEST mud motor",
      videoId: "abc123",
      channelIdentifiers: ["@lukemcfadden", "name:luke mcfadden"],
    });
  });

  it("extracts compact and lockup renderers without duplicates", () => {
    document.body.innerHTML = `
      <ytd-compact-video-renderer><a id="video-title" href="/watch?v=one">One</a></ytd-compact-video-renderer>
      <yt-lockup-view-model><h3><a href="/watch?v=two">Two</a></h3></yt-lockup-view-model>`;
    expect(findRendererRoots(document)).toHaveLength(2);
    expect(findRendererRoots(document).map((root) => extractCandidate(root)?.videoId)).toEqual(["one", "two"]);
  });

  it("extracts a Shorts card", () => {
    document.body.innerHTML = `
      <ytd-reel-item-renderer>
        <a href="/shorts/short42" title="I tested Temu's worst gadget"></a>
      </ytd-reel-item-renderer>`;
    expect(extractCandidate(document.querySelector("ytd-reel-item-renderer")!)?.videoId).toBe("short42");
  });

  it("finds and extracts a playlist pinned to a channel page", () => {
    document.body.innerHTML = `
      <ytd-grid-playlist-renderer>
        <a id="playlist-title" href="/playlist?list=PL123" title="Walmart's cheapest mini bikes"></a>
        <ytd-channel-name><a href="/@FactoryChannel">Factory Channel</a></ytd-channel-name>
      </ytd-grid-playlist-renderer>`;
    const roots = findRendererRoots(document);
    expect(roots).toHaveLength(1);
    expect(extractCandidate(roots[0])).toEqual({
      title: "Walmart's cheapest mini bikes",
      videoId: undefined,
      channelIdentifiers: ["@factorychannel", "name:factory channel"],
    });
  });

  it("finds a featured channel video renderer", () => {
    document.body.innerHTML = `
      <ytd-channel-video-player-renderer>
        <a id="video-title" href="/watch?v=featured" title="Bought the cheapest bike from Temu"></a>
      </ytd-channel-video-player-renderer>`;
    const root = findRendererRoots(document)[0];
    expect(extractCandidate(root)?.videoId).toBe("featured");
  });
});
