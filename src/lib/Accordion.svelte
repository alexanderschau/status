<script lang="ts">
  import { ServiceGroupType } from "./loadData";

  export let open = true;
  export let data: ServiceGroupType;
</script>

<div class="my-5">
  <div
    on:click={() => {
      open = !open;
    }}
    class="bg-gray-100 blockElem cursor-pointer"
  >
  <svg xmlns="http://www.w3.org/2000/svg" height="1em" width="1em" fill="currentColor" class={"inline-block align-middle mr-4"+(open?" rotate-90":"")} viewBox="0 0 16 16">
    <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
  </svg>
    {data.name}
  </div>
  {#if open}
    {#each data.services as service}
      <div class="flex py-3 pl-8 px-4">
        <div class="flex-1 inline-block">{service.name}</div>
        <div class="inline-block" style={`color: ${service.status.color}`}>
          {service.status.name}
        </div>
      </div>
    {/each}
  {/if}
  <slot />
</div>

<style>
  .blockElem {
    @apply py-3 px-5;
  }
</style>
