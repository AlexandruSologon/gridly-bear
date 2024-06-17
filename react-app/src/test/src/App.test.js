import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';
import React, {useState} from 'react';
import Sidebar  from "../../interface-elements/Sidebar";
import RunButton from "../../interface-elements/RunButton";
import LockButton from "../../interface-elements/LockButton";
import {iconMappingMock} from "../mocks/iconMappingMock";
import {handleMarkerDelete} from "../../utils/api";

  jest.mock('react-leaflet', () => jest.fn());
  jest.mock('firebase-functions', () => jest.fn());

test('Lock', () => {
  render (<LockButton onLockButtonClick={jest.fn()} />);
  const button = screen.getByTestId('lockbutton');
    fireEvent.click(button);
    expect(screen.getByTestId('lock-close-icon')).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByTestId('lock-open-icon')).toBeInTheDocument();
});



test('Sidebar', () => {
  render(<Sidebar
                sidebarItems = {[{id: 1, name: 'Solar Panel', type: 'solar'}]}
                handleDragStart = {jest.fn()}
                handleDragEnd = {jest.fn()}
                iconMapping ={iconMappingMock}
                />);
  const sidebar = screen.getByTestId('sidebar');
  expect(sidebar).toContainElement(screen.getByText(/Solar Panel/i));
  const toggleB = screen.getByTestId('retract-sidebar');
  expect(screen.getByTestId('sidebar').style.display).toEqual('grid')
  expect(screen.getByTestId('retract-sidebar-icon-right').style.display).toEqual('none');
  fireEvent.click(toggleB);
   expect(screen.getByTestId('retract-sidebar-icon-right').style.display).toEqual('flex');
  expect(screen.getByTestId('retract-sidebar-icon-left').style.display).toEqual('none')
  expect(screen.getByTestId('sidebar').style.display).toEqual('grid')
  expect(screen.getByTestId("draggable-solar").style.backgroundColor).toEqual('inherit');
  fireEvent.mouseOver(screen.getByTestId("draggable-solar"))
  expect(screen.getByTestId("draggable-solar").style.backgroundColor).toEqual('rgb(230, 230, 230)');
  fireEvent.mouseOut(screen.getByTestId("draggable-solar"))
  expect(screen.getByTestId("draggable-solar").style.backgroundColor).toEqual('inherit');


});

test('Run Button', () => {
    render(<RunButton onRunButtonClick={jest.fn()} runClicked={false} />)
    expect(screen.getByTestId('run-button')).toBeInTheDocument()
})


test('Run Button Clicked', () => {
    render(<RunButton onRunButtonClick={jest.fn()} runClicked={true} />)
    expect(screen.getByTestId('run-button')).toBeInTheDocument()
})

test('Delete Marker ', () => {
    let m = [{id: 0,
                position: jest.fn(),
                name: 'name',
                icon: jest.fn(),
                type: 'type',
                parameters: jest.fn(),
            }];
        const setM = (newM) => {
        m = newM
    }
    const markerId = 0;
    const markerRefs = {current: jest.fn()}
    const setSelectedMarker = jest.fn()
    const lines = []
    const setLines = jest.fn()
    const selectedMarker = 0
 handleMarkerDelete(markerId, m, markerRefs, setM, selectedMarker, setSelectedMarker, lines, setLines)
    expect(m).toEqual([])

})

