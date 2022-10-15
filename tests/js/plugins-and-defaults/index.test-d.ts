import { expectType } from "tsd";
import { Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api-ghes-3.2";

import { OctokitWithDefaultsAndPlugins } from "./index.js";
import { fooPlugin } from "./plugins/foo/index.js";
import { barPlugin } from "./plugins/bar/index.js";
import { voidPlugin } from "./plugins/void/index.js";
import { withOptionsPlugin } from "./plugins/with-options/index.js";

export async function test() {
  // @ts-expect-error - options are required
  new OctokitWithDefaultsAndPlugins();

  // @ts-expect-error - bar option is required
  new OctokitWithDefaultsAndPlugins({});

  const octokit = new OctokitWithDefaultsAndPlugins({
    optional: "foo",
    required: "bar",
  });

  const emojisResponse = await octokit.request("GET /");
  expectType<string>(emojisResponse.data["emojis_url"]);

  expectType<string>(octokit.foo);
  expectType<string>(octokit.bar);
  expectType<string>(octokit.getOptionalOption());
  expectType<string>(octokit.getRequriedOption());

  // multi-layred chainging of .withDefaults().withPlugins()

  const OctokitLevelOne = Octokit.withPlugins([fooPlugin]).withDefaults({
    defaultOne: "value",
    required: "1.2.3",
  });

  // Because 'required' is already provided, this needs no argument
  new OctokitLevelOne();
  new OctokitLevelOne({});

  expectType<
    // no idea why `tsd` requires us to split this object up into two ¯\_(ツ)_/¯
    {
      defaultOne: string;
      required: string;
    } & {
      baseUrl: string;
      userAgent: string;
    }
  >(OctokitLevelOne.DEFAULTS);

  const octokitLevelOne = new OctokitLevelOne({
    optionOne: "value",
  });

  expectType<string>(octokitLevelOne.options.defaultOne);
  expectType<string>(octokitLevelOne.options.optionOne);
  expectType<string>(octokitLevelOne.options.required);
  // @ts-expect-error unknown properties cannot be used, see #31
  octokitLevelOne.unknown;

  const OctokitLevelTwo = OctokitLevelOne.withDefaults({
    defaultTwo: 0,
  });

  expectType<{
    baseUrl: string;
    userAgent: string;
    defaultOne: string;
    defaultTwo: number;
    required: string;
  }>({ ...OctokitLevelTwo.DEFAULTS });

  // Because 'required' is already provided, this needs no argument
  new OctokitLevelTwo();
  new OctokitLevelTwo({});

  // 'required' may be overriden, though it's not necessary
  new OctokitLevelTwo({
    required: "new required",
  });

  const octokitLevelTwo = new OctokitLevelTwo({
    optionTwo: true,
  });

  expectType<number>(octokitLevelTwo.options.defaultTwo);
  expectType<string>(octokitLevelTwo.options.defaultOne);
  expectType<boolean>(octokitLevelTwo.options.optionTwo);
  expectType<string>(octokitLevelTwo.options.required);
  // @ts-expect-error unknown properties cannot be used, see #31
  octokitLevelTwo.unknown;

  const OctokitLevelThree = OctokitLevelTwo.withDefaults({
    defaultThree: ["a", "b", "c"],
  });

  expectType<{
    baseUrl: string;
    userAgent: string;
    defaultOne: string;
    defaultTwo: number;
    defaultThree: string[];
    required: string;
  }>({ ...OctokitLevelThree.DEFAULTS });

  // Because 'required' is already provided, this needs no argument
  new OctokitLevelThree();
  new OctokitLevelThree({});

  // Previous settings may be overriden, though it's not necessary
  new OctokitLevelThree({
    optionOne: "",
    optionTwo: false,
    required: "new required",
  });

  const octokitLevelThree = new OctokitLevelThree({
    optionThree: [0, 1, 2],
  });

  expectType<string>(octokitLevelThree.options.defaultOne);
  expectType<number>(octokitLevelThree.options.defaultTwo);
  expectType<string[]>(octokitLevelThree.options.defaultThree);
  expectType<number[]>(octokitLevelThree.options.optionThree);
  expectType<string>(octokitLevelThree.options.required);
  // @ts-expect-error unknown properties cannot be used, see #31
  octokitLevelThree.unknown;

  const OctokitWithVoidPlugin = Octokit.withPlugins([voidPlugin]);
  const octokitWithVoidPlugin = new OctokitWithVoidPlugin({
    required: "1.2.3",
  });

  // @ts-expect-error unknown properties cannot be used, see #31
  octokitWithVoidPlugin.unknown;

  const OctokitWithFooAndBarPlugins = Octokit.withPlugins([
    barPlugin,
    fooPlugin,
  ]);
  const octokitWithFooAndBarPlugins = new OctokitWithFooAndBarPlugins({
    required: "1.2.3",
  });

  expectType<string>(octokitWithFooAndBarPlugins.foo);
  expectType<string>(octokitWithFooAndBarPlugins.bar);

  // @ts-expect-error unknown properties cannot be used, see #31
  octokitWithFooAndBarPlugins.unknown;

  const OctokitWithVoidAndNonVoidPlugins = Octokit.withPlugins([
    barPlugin,
    voidPlugin,
    fooPlugin,
  ]);
  const octokitWithVoidAndNonVoidPlugins = new OctokitWithVoidAndNonVoidPlugins(
    {
      required: "1.2.3",
    }
  );

  expectType<string>(octokitWithVoidAndNonVoidPlugins.foo);
  expectType<string>(octokitWithVoidAndNonVoidPlugins.bar);

  // @ts-expect-error unknown properties cannot be used, see #31
  octokitWithVoidAndNonVoidPlugins.unknown;

  const OctokitWithOptionsPlugin = Octokit.withPlugins([withOptionsPlugin]);
  const octokitWithOptionsPlugin = new OctokitWithOptionsPlugin({
    required: "1.2.3",
  });

  expectType<string>(octokitWithOptionsPlugin.getOptionalOption());

  // Test depth limits of `.withDefaults()` chaining
  const OctokitLevelFour = OctokitLevelThree.withDefaults({ defaultFour: 4 });

  expectType<{
    baseUrl: string;
    userAgent: string;
    required: string;
    defaultOne: string;
    defaultTwo: number;
    defaultThree: string[];
    defaultFour: number;
  }>({ ...OctokitLevelFour.DEFAULTS });

  const octokitLevelFour = new OctokitLevelFour();

  // See the node on static defaults in index.d.ts for why defaultFour is missing
  // .options from .withDefaults() is only supported until a depth of 4
  expectType<{
    required: string;
    defaultOne: string;
    defaultTwo: number;
    defaultThree: string[];
  }>({ ...octokitLevelFour.options });

  expectType<{
    required: string;
    defaultOne: string;
    defaultTwo: number;
    defaultThree: string[];
    defaultFour: number;
    // @ts-expect-error - .options from .withDefaults() is only supported until a depth of 4
  }>({ ...octokitLevelFour.options });

  const OctokitWithChainedDefaultsAndPlugins = Octokit.withDefaults({
    defaultOne: "value",
  })
    .withPlugins([fooPlugin])
    .withDefaults({
      defaultTwo: 0,
    });

  const octokitWithChainedDefaultsAndPlugins =
    new OctokitWithChainedDefaultsAndPlugins({
      required: "1.2.3",
    });

  expectType<string>(octokitWithChainedDefaultsAndPlugins.foo);

  const OctokitWithManyChainedDefaultsAndPlugins = Octokit.withDefaults({
    defaultOne: "value",
  })
    .withPlugins([fooPlugin, barPlugin, voidPlugin])
    .withDefaults({
      defaultTwo: 0,
    })
    .withPlugins([withOptionsPlugin])
    .withDefaults({
      defaultThree: ["a", "b", "c"],
    });

  expectType<{
    baseUrl: string;
    userAgent: string;
    defaultOne: string;
    defaultTwo: number;
    defaultThree: string[];
  }>({ ...OctokitWithManyChainedDefaultsAndPlugins.DEFAULTS });

  const octokitWithManyChainedDefaultsAndPlugins =
    new OctokitWithManyChainedDefaultsAndPlugins({
      required: "1.2.3",
      foo: "bar",
    });

  expectType<string>(octokitWithManyChainedDefaultsAndPlugins.foo);
  expectType<string>(octokitWithManyChainedDefaultsAndPlugins.bar);
  expectType<string>(
    octokitWithManyChainedDefaultsAndPlugins.getOptionalOption()
  );

  // versions

  const octokitCoreWithGhes32Version = new Octokit({
    version: "ghes-3.2",
    required: "",
  });

  const response = await octokitCoreWithGhes32Version.request(
    "GET /admin/hooks/{hook_id}",
    {
      hook_id: 1,
    }
  );
  expectType<number | undefined>(response.data.id);

  const OctokitGHES32 = Octokit.withDefaults({
    version: "ghes-3.2",
  });
  const octokitGhes31 = new OctokitGHES32({
    required: "",
  });

  // @ts-expect-error - `GET /marketplace_listing/plans` only exists on `github.com`
  await octokitGhes31.request("GET /marketplace_listing/plans");
}
