import styled from "styled-components";

const Typography = styled.p`
  font-weight: var(--fw-400);
  line-height: 1.05;
  text-transform: uppercase;
  text-shadow: 3px 5px 5px rgba(0, 0, 0, 0.5);
  color: var(--heading-default);
`;

export const Heading = styled(Typography)`
  font-family: var(--font-accent);
  font-size: ${(props) => props.fontSize || "var(--fs-600)"};
  ${(props) =>
    props.light === "true" &&
    "filter: brightness(1.6); text-shadow: 0px 0px 10px rgba(224, 165, 115, 0.66), 0px 0px 10px #C85541, 0px 4px 15px #000000;"}
`;

export const Leading = styled(Typography)`
  font-family: var(--font-accent-b);
  font-size: ${(props) => props.fontSize || "var(--fs-800)"};
  ${(props) =>
    props.light === "true" &&
    "filter: brightness(1.6); text-shadow: 0px 0px 10px rgba(224, 165, 115, 0.66), 0px 0px 10px #C85541, 0px 4px 15px #000000;"}
`;

export const RegularText = styled(Typography)`
  font-family: var(--font-accent-b);
  font-size: ${(props) => props.fontSize || "var(--fs-800)"};
  color: #d1a781; 
  ${(props) =>
    props.light === "true" &&
    "filter: brightness(1.6); text-shadow: 0px 0px 10px rgba(224, 165, 115, 0.66), 0px 0px 10px #C85541, 0px 4px 15px #000000;"}
`;

export const StatusText = styled(Typography)`
  font-family: var(--font-accent-b);
  font-size: ${(props) => props.fontSize || "var(--fs-800)"};
  color: ${(props)=>props.color || "#f0a500; "}
  ${(props) =>
    props.light === "true" &&
    "filter: brightness(1.6); text-shadow: 0px 0px 10px rgba(224, 165, 115, 0.66), 0px 0px 10px #C85541, 0px 4px 15px #000000;"}
`;


export const Text = styled.p`
  font-family: var(--font-default);
  font-size: var(--fs-400);
  font-weight: var(--fw-500);
  text-shadow: 3px 5px 5px rgba(0, 0, 0, 0.5);
  color: var(--text-default);
`;
