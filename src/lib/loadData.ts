/*import { readFileSync } from "fs";
import * as yaml from "js-yaml";*/

export type ServiceGroupType = {
  name: string;
  description?: string;
  services: ServiceType[];
};
export type ServiceType = {
  name: string;
  description?: string;
  status: StatusType;
};
export type StatusType = {
  name: string;
  color: string;
};

export type IncidentType = {
  name: string;
  from: string;
  to?: string;
  content: string;
};

export type YamlInputType = {
  groups: {
    name: string;
    description?: string;
    services: {
      name: string;
      description?: string;
      status?: string;
    }[];
  }[];
  defaultStatus: string;
  states: {
    name: string;
    color: string;
  }[];
};

export type IncidentInputType = {
  title: string;
  startedAt: string;
  resolvedAt?: string;
  affected: { group: string; service: string }[];
  status: string;
  content: { source: string };
};

export type ResponseType = {
  services: ServiceGroupType[];
  incidents: {
    current: IncidentType[];
    past: IncidentType[];
  };
};

export const getData = (
  yaml: YamlInputType,
  incidents: IncidentInputType[]
): ResponseType => {
  // load Services
  let res: ServiceGroupType[] = [];
  for (const group of yaml.groups) {
    let services: ServiceType[] = [];

    for (const service of group.services) {
      let status = getStatusByName(yaml, service.status);

      const relatedIncidents = incidents.filter(
        (incident) =>
          !incident.resolvedAt &&
          incident.affected.filter(
            (a) => a.group == group.name && a.service == service.name
          ).length > 0
      );
      if (relatedIncidents.length > 0) {
        status = getStatusByName(yaml, relatedIncidents[0].status);
      }
      if (!status) status = getStatusByName(yaml, yaml.defaultStatus);

      services = [
        ...services,
        {
          name: service.name,
          description: service.description,
          status: status,
        },
      ];
    }

    res = [
      ...res,
      {
        name: group.name,
        description: group.description,
        services: services,
      },
    ];
  }

  // load Incidents
  let currI: IncidentType[] = [];
  let pastI: IncidentType[] = [];
  for (const incident of incidents) {
    const res: IncidentType = {
      name: incident.title,
      from: new Date(incident.startedAt).toLocaleString(),
      to: incident.resolvedAt
        ? new Date(incident.resolvedAt).toLocaleString()
        : null,
      content: incident.content.source,
    };
    if (res.to) {
      pastI = [...pastI, res];
    } else {
      currI = [...currI, res];
    }
  }

  return { services: res, incidents: { current: currI, past: pastI } };
};

const getStatusByName = (yaml: YamlInputType, statusName: string): StatusType =>
  yaml.states.filter((status) => status.name == statusName)[0];
