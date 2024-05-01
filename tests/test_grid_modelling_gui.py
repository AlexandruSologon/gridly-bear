#!/usr/bin/env python

"""Tests for `grid_modelling_gui` package."""

import pytest
import pandapower as pp
from src.grid_modelling_gui import grid_modelling_gui as main


@pytest.fixture
def response():
    """Sample pytest fixture.

    See more at: https://doc.pytest.org/en/latest/fixture.html
    """
    # import requests
    # return requests.get('https://github.com/audreyr/cookiecutter-pypackage')


def test_content():
    net = pp.create_empty_network(name="network")

    # create buses
    b1 = pp.create_bus(net, vn_kv=20., name="bus 1")
    b2 = pp.create_bus(net, vn_kv=.4, name="bus 2")
    b3 = pp.create_bus(net, vn_kv=.4, name="bus 3")

    # create bus elements
    pp.create_ext_grid(net, bus=b1, vm_pu=1.02, name="Grid connection")
    pp.create_load(net, bus=b3, p_mw=0.1, q_mvar=0.05, name="Load")

    # create branch elements
    tid = pp.create_transformer(net, hv_bus=b1, lv_bus=b2, std_type="0.4 MVA 20/0.4 kV", name="Trafo")
    pp.create_line(net, from_bus=b2, to_bus=b3, length_km=0.1, name="Line", std_type="NAYY 4x50 SE")
    assert main.isworking(net) is False
    """Sample pytest test function with the pytest fixture as an argument."""
    # from bs4 import BeautifulSoup
    # assert 'GitHub' in BeautifulSoup(response.content).title.string
