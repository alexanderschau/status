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
